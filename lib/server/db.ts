import "server-only";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { initialServers } from "@/lib/data";
import type { ServerDetail, ServerListResponse } from "@/types";

const databasePath =
  process.env.DATABASE_PATH || resolve(process.cwd(), "data/hub.sqlite");
if (databasePath !== ":memory:")
  mkdirSync(dirname(databasePath), { recursive: true });
const globalDatabase = globalThis as typeof globalThis & {
  hubDatabase?: Database.Database;
};
export const db = globalDatabase.hubDatabase ?? new Database(databasePath);
globalDatabase.hubDatabase = db;
db.pragma("busy_timeout = 10000");
try {
  db.pragma("journal_mode = WAL");
} catch (error) {
  // A concurrent Next.js worker may already be switching the journal mode.
  // Its connection completes that transition; subsequent writes still honor busy_timeout.
  if ((error as { code?: string }).code !== "SQLITE_BUSY") throw error;
}
db.pragma("foreign_keys = ON");
db.transaction(() =>
  db.exec(`
CREATE TABLE IF NOT EXISTS hub_servers (id TEXT PRIMARY KEY, qualified_name TEXT UNIQUE NOT NULL, owner_id TEXT, status TEXT NOT NULL DEFAULT 'published', data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS hub_favorites (user_id TEXT NOT NULL, server_id TEXT NOT NULL REFERENCES hub_servers(id) ON DELETE CASCADE, PRIMARY KEY(user_id, server_id));
CREATE TABLE IF NOT EXISTS hub_profiles (user_id TEXT PRIMARY KEY, username TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS hub_configs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, server_name TEXT NOT NULL, encrypt_config_data TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(user_id, server_name));
CREATE TABLE IF NOT EXISTS hub_events (id TEXT PRIMARY KEY, kind TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL);
`),
)();
const seed = db.prepare(
  "INSERT OR IGNORE INTO hub_servers(id, qualified_name, data) VALUES (?, ?, ?)",
);
db.transaction(() => {
  for (const record of initialServers) {
    const qualifiedName =
      record.qualifiedName || new URL(record.source).pathname.slice(1);
    seed.run(
      record.id,
      qualifiedName,
      JSON.stringify({
        ...record,
        qualifiedName,
        serverConfigs: [],
        catalogUpdatedAt: record.updatedAt,
      }),
    );
  }
})();

export interface CatalogParams {
  page?: number;
  pageSize?: number;
  cat?: string;
  search?: string;
  developer?: string;
  sort?: string;
  direction?: string;
  official?: boolean;
  ownerId?: string;
}
export function getServer(name: string): ServerDetail | undefined {
  const row = db
    .prepare(
      "SELECT data FROM hub_servers WHERE (id = ? OR qualified_name = ?) AND status = 'published'",
    )
    .get(name, name) as { data: string } | undefined;
  return row ? JSON.parse(row.data) : undefined;
}
export function listServers(params: CatalogParams = {}): ServerListResponse {
  const rows = db
    .prepare(
      "SELECT data FROM hub_servers WHERE status = 'published' AND (? IS NULL OR owner_id = ?)",
    )
    .all(params.ownerId ?? null, params.ownerId ?? null) as { data: string }[];
  let servers: ServerDetail[] = rows.map((row) => JSON.parse(row.data));
  const search = params.search?.slice(0, 200).toLowerCase();
  servers = servers.filter(
    (server) =>
      (!params.cat ||
        params.cat.toLowerCase() === "all" ||
        server.cat === params.cat) &&
      (!params.developer || server.developer === params.developer) &&
      (!params.official || server.isOfficial) &&
      (!search ||
        `${server.name} ${server.description || ""} ${server.developer}`
          .toLowerCase()
          .includes(search)),
  );
  const fields: Record<string, keyof ServerDetail> = {
    github_stars: "githubStars",
    created_at: "createdAt",
    updated_at: "updatedAt",
    name: "name",
    downloads: "downloads",
    views: "views",
    rating: "rating",
  };
  const field = fields[params.sort || "github_stars"] || "githubStars";
  servers.sort((a, b) => {
    const av = a[field] ?? 0,
      bv = b[field] ?? 0;
    const compare =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
    return (params.direction === "asc" ? 1 : -1) * compare;
  });
  const page = Math.max(
    1,
    Math.min(100000, Math.floor(Number(params.page) || 1)),
  );
  const pageSize = Math.max(
    1,
    Math.min(100, Math.floor(Number(params.pageSize) || 20)),
  );
  return {
    page,
    pageSize,
    total: servers.length,
    hasNext: page * pageSize < servers.length,
    hasPrev: page > 1,
    servers: servers.slice((page - 1) * pageSize, page * pageSize),
  };
}
