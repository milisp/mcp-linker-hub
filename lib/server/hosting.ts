import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "./db";
import { getHostedDailyLimit } from "./billing";

const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,64}$/),
  name: z.string().min(1).max(100),
  url: z
    .url()
    .refine((value) => new URL(value).protocol === "https:", "HTTPS required"),
  tokenEnv: z.string().regex(/^[A-Z][A-Z0-9_]+$/),
  reviewReference: z.string().min(1),
  stateless: z.literal(true),
});

export function hostedServices() {
  const services = z
    .array(serviceSchema)
    .max(20)
    .parse(JSON.parse(process.env.HOSTED_MCP_SERVICES || "[]"));
  if (new Set(services.map((service) => service.id)).size !== services.length)
    throw new Error("Duplicate hosted service ID");
  return services;
}

function setup() {
  db.exec(`CREATE TABLE IF NOT EXISTS hosted_keys (
    id TEXT PRIMARY KEY, user_id TEXT NOT NULL, token_hash TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL, expires_at TEXT NOT NULL, revoked_at TEXT
  );
  CREATE TABLE IF NOT EXISTS hosted_usage (
    user_id TEXT NOT NULL, day TEXT NOT NULL, requests INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id, day)
  );
  CREATE TABLE IF NOT EXISTS hosted_rate (
    user_id TEXT NOT NULL, minute TEXT NOT NULL, requests INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id, minute)
  );`);
}

export function listKeys(userId: string) {
  setup();
  return db
    .prepare(
      "SELECT id, created_at AS createdAt, expires_at AS expiresAt FROM hosted_keys WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ? ORDER BY created_at DESC",
    )
    .all(userId, new Date().toISOString());
}

export function issueKey(userId: string) {
  setup();
  return db.transaction(() => {
    if (listKeys(userId).length >= 5)
      throw new Error("Revoke an existing key before creating another");
    const token = `mlh_${randomBytes(32).toString("base64url")}`;
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 90 * 86400000).toISOString();
    db.prepare(
      "INSERT INTO hosted_keys (id, user_id, token_hash, created_at, expires_at) VALUES (?, ?, ?, ?, ?)",
    ).run(id, userId, hash(token), createdAt, expiresAt);
    return { id, token, createdAt, expiresAt };
  })();
}

export function revokeKey(userId: string, id: string) {
  setup();
  return (
    db
      .prepare(
        "UPDATE hosted_keys SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL",
      )
      .run(new Date().toISOString(), id, userId).changes > 0
  );
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function authorizeHosted(request: Request): string | null {
  setup();
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (mlh_[A-Za-z0-9_-]{43})$/)?.[1];
  if (!token) return null;
  const key = db
    .prepare(
      "SELECT user_id FROM hosted_keys WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?",
    )
    .get(hash(token), new Date().toISOString()) as
    | { user_id: string }
    | undefined;
  return key?.user_id || null;
}

export function reserveRequest(userId: string) {
  setup();
  const now = new Date().toISOString();
  const day = now.slice(0, 10),
    minute = now.slice(0, 16);
  const parsed = getHostedDailyLimit(userId);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return false;
  return db.transaction(() => {
    const daily = db
      .prepare(
        "SELECT requests FROM hosted_usage WHERE user_id = ? AND day = ?",
      )
      .get(userId, day) as { requests: number } | undefined;
    const rate = db
      .prepare(
        "SELECT requests FROM hosted_rate WHERE user_id = ? AND minute = ?",
      )
      .get(userId, minute) as { requests: number } | undefined;
    if ((daily?.requests || 0) >= parsed || (rate?.requests || 0) >= 20)
      return false;
    db.prepare(
      "INSERT INTO hosted_usage VALUES (?, ?, 1) ON CONFLICT(user_id, day) DO UPDATE SET requests = requests + 1",
    ).run(userId, day);
    db.prepare(
      "INSERT INTO hosted_rate VALUES (?, ?, 1) ON CONFLICT(user_id, minute) DO UPDATE SET requests = requests + 1",
    ).run(userId, minute);
    db.prepare("DELETE FROM hosted_rate WHERE minute < ?").run(minute);
    return true;
  })();
}

export function safeOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.BETTER_AUTH_URL || new URL(request.url).origin;
  return origin === new URL(expected).origin;
}
