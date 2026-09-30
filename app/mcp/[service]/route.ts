import {
  authorizeHosted,
  hostedServices,
  reserveRequest,
} from "@/lib/server/hosting";
import { getHostedDailyLimit } from "@/lib/server/billing";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ service: string }> },
) {
  const origin = request.headers.get("origin");
  if (
    origin &&
    origin !== new URL(process.env.BETTER_AUTH_URL || request.url).origin
  )
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const userId = authorizeHosted(request);
  if (!userId)
    return Response.json(
      { error: "Valid hosted access key required" },
      {
        status: 401,
        headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" },
      },
    );
  const { service: id } = await context.params;
  const service = hostedServices().find((item) => item.id === id);
  if (!service)
    return Response.json(
      { error: "Hosted service not found" },
      { status: 404 },
    );
  if (getHostedDailyLimit(userId) < 1)
    return Response.json(
      { error: "An active hosting plan is required" },
      { status: 403 },
    );
  const upstreamToken = process.env[service.tokenEnv];
  if (!upstreamToken)
    return Response.json(
      { error: "Hosted service is not configured" },
      { status: 503 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json({ error: "JSON required" }, { status: 415 });
  if (request.headers.has("mcp-session-id"))
    return Response.json(
      { error: "This gateway supports stateless services only" },
      { status: 400 },
    );
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "Request body required" }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 262144) {
      await reader.cancel();
      return Response.json({ error: "Request too large" }, { status: 413 });
    }
    chunks.push(value);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  try {
    const rpc = JSON.parse(body);
    if (
      !rpc ||
      Array.isArray(rpc) ||
      rpc.jsonrpc !== "2.0" ||
      typeof rpc.method !== "string"
    )
      throw new Error();
  } catch {
    return Response.json(
      { error: "A JSON-RPC 2.0 request is required" },
      { status: 400 },
    );
  }
  if (!reserveRequest(userId))
    return Response.json(
      { error: "Request limit reached" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${upstreamToken}`,
    };
    const protocol = request.headers.get("mcp-protocol-version");
    if (protocol) headers["MCP-Protocol-Version"] = protocol;
    const upstream = await fetch(service.url, {
      method: "POST",
      headers,
      body,
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
    if (upstream.headers.has("mcp-session-id")) {
      await upstream.body?.cancel();
      return Response.json(
        { error: "Upstream requires sessions; configure a stateless service" },
        { status: 502 },
      );
    }
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return Response.json(
        { error: "Upstream request failed" },
        { status: 502 },
      );
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "Hosted service unavailable" },
      { status: 502 },
    );
  }
}
