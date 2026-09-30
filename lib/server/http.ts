import { createHash, randomUUID } from "node:crypto";
import { db } from "./db";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(process.env.BETTER_AUTH_URL || request.url)
    .origin;
  if (request.headers.has("cookie") && !origin)
    throw new HttpError(403, "Origin is required for authenticated mutations");
  if (origin && origin !== expectedOrigin)
    throw new HttpError(403, "Cross-origin mutations are not allowed");
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new HttpError(403, "Cross-site mutations are not allowed");
}
export async function readBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "JSON content type is required");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Request body is required");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 65536) {
      await reader.cancel();
      throw new HttpError(413, "Request body is too large");
    }
    chunks.push(value);
  }
  const bytes = Buffer.concat(chunks);
  try {
    const data = JSON.parse(bytes.toString());
    if (!data || typeof data !== "object" || Array.isArray(data))
      throw new Error();
    return data;
  } catch {
    throw new HttpError(400, "Invalid JSON object");
  }
}
export function textField(
  data: Record<string, unknown>,
  key: string,
  max = 200,
  optional = false,
): string {
  const value = data[key];
  if (optional && (value === undefined || value === null || value === ""))
    return "";
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new HttpError(400, `Invalid ${key}`);
  return value.trim();
}
export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError)
    return Response.json({ detail: error.message }, { status: error.status });
  if (error instanceof Error && error.message.includes("UNIQUE constraint"))
    return Response.json({ detail: "Record already exists" }, { status: 409 });
  console.error(
    "API request failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return Response.json({ detail: "Request failed" }, { status: 500 });
}
export async function savePublicEvent(
  request: Request,
  kind: string,
): Promise<Response> {
  try {
    checkOrigin(request);
    const data = await readBody(request);
    const email =
      kind !== "deeplink-clicks"
        ? textField(data, "email", 254, kind === "feedback")
        : "";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new HttpError(400, "Invalid email");
    const stored: Record<string, unknown> =
      kind === "early-access"
        ? { email }
        : kind === "feedback"
          ? {
              email,
              usage: textField(data, "usage", 5000),
              intent: textField(data, "intent", 30),
              source: textField(data, "source", 30),
            }
          : {
              repo: textField(data, "repo", 300, true),
              name: textField(data, "name", 200, true),
              source: textField(data, "source", 100, true),
              auto_submit: data.auto_submit === true,
            };
    if (
      kind === "feedback" &&
      (!["free", "solo", "team_pro", "enterprise"].includes(
        String(stored.intent),
      ) ||
        ![
          "github",
          "reddit",
          "ai",
          "twitter",
          "search",
          "friend",
          "other",
        ].includes(String(stored.source)) ||
        String(stored.usage).length < 10)
    )
      throw new HttpError(400, "Invalid feedback");
    const minuteCount = db
      .prepare(
        "SELECT count(*) AS count FROM hub_events WHERE kind = ? AND created_at > ?",
      )
      .get(kind, new Date(Date.now() - 60000).toISOString()) as {
      count: number;
    };
    if (minuteCount.count >= 60)
      throw new HttpError(429, "Submission limit reached");
    // Deduplicate retries and cap submissions for each email within an hour.
    const fingerprint = createHash("sha256")
      .update(JSON.stringify(stored))
      .digest("hex");
    const id = `${kind}:${fingerprint}`;
    if (email) {
      const recent = db
        .prepare(
          "SELECT count(*) AS count FROM hub_events WHERE kind = ? AND json_extract(data, '$.email') = ? AND created_at > ?",
        )
        .get(kind, email, new Date(Date.now() - 3600000).toISOString()) as {
        count: number;
      };
      if (recent.count >= 5)
        throw new HttpError(429, "Submission limit reached");
    }
    db.prepare("INSERT OR IGNORE INTO hub_events VALUES (?, ?, ?, ?)").run(
      kind === "deeplink-clicks" ? randomUUID() : id,
      kind,
      JSON.stringify(stored),
      new Date().toISOString(),
    );
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
