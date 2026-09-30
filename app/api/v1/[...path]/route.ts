import { randomUUID } from "node:crypto";
import { cats } from "@/lib/data";
import { db, getServer, listServers } from "@/lib/server/db";
import { getBillingStatus, getBillingProducts } from "@/lib/server/billing";
import { getCurrentUser } from "@/lib/server/auth";
import {
  checkOrigin,
  errorResponse,
  HttpError,
  readBody,
  textField,
} from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
async function handle(request: Request, context: Context) {
  try {
    const { path } = await context.params;
    const route = path.join("/");
    const method = request.method;
    const url = new URL(request.url);
    const query = url.searchParams;
    if (method !== "GET") checkOrigin(request);
    if (method === "GET" && route === "categories/simple")
      return Response.json(cats);
    if (method === "GET" && route === "health")
      return Response.json({ status: "ok" });
    if (
      method === "GET" &&
      [
        "servers",
        "servers/minimal",
        "servers/recommended",
        "servers/recommendations/official",
      ].includes(route)
    )
      return Response.json(
        listServers({
          page: Number(query.get("page")),
          pageSize: Number(query.get("page_size")),
          cat: query.get("cat") || undefined,
          search: query.get("search") || undefined,
          developer: query.get("developer") || undefined,
          sort: query.get("sort") || undefined,
          direction: query.get("direction") || undefined,
          official: route.endsWith("official"),
        }),
      );
    if (method === "GET" && route === "server_configs") {
      const server = getServer(query.get("server_id") || "");
      if (!server) throw new HttpError(404, "Server not found");
      return Response.json(
        server.serverConfigs.flatMap((group) => group.configItems),
      );
    }
    if (method === "GET" && path[0] === "servers" && path[1]?.startsWith("@")) {
      const server = getServer(route.slice("servers/@".length));
      if (!server) throw new HttpError(404, "Server not found");
      return Response.json(server);
    }
    const user = await getCurrentUser(request);
    if (!user) throw new HttpError(401, "Sign in is required");
    if (path[0] === "teams" || route === "users/by-email")
      throw new HttpError(
        501,
        "Team collaboration is not yet available in this backend",
      );
    if (route === "users/me") {
      if (method === "PATCH") {
        const body = await readBody(request);
        const username = textField(body, "username", 80);
        db.prepare(
          "INSERT INTO hub_profiles VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET username = excluded.username",
        ).run(user.id, username);
      } else if (method !== "GET")
        throw new HttpError(405, "Method not allowed");
      const profile = db
        .prepare("SELECT username FROM hub_profiles WHERE user_id = ?")
        .get(user.id) as { username: string } | undefined;
      const billing = getBillingStatus(user.id);
      const tier =
        billing.entitlements.find((entitlement) => entitlement.active)?.tier ||
        "FREE";
      return Response.json({
        ...user,
        username: profile?.username || user.name,
        fullname: user.name,
        tier,
        trial_active: false,
      });
    }
    if (route === "users/start-trial" || route === "webhooks/polar")
      throw new HttpError(501, "Billing has not been configured");
    if (method === "GET" && route === "tiers")
      return Response.json([
        "FREE",
        ...new Set(getBillingProducts().map((product) => product.tier)),
      ]);
    if (method === "GET" && route === "subscriptions")
      return Response.json(getBillingStatus(user.id).entitlements);
    if (route === "servers/favorites" && method === "GET") {
      const rows = db
        .prepare(
          "SELECT s.data FROM hub_servers s JOIN hub_favorites f ON f.server_id = s.id WHERE f.user_id = ? AND s.status = 'published'",
        )
        .all(user.id) as { data: string }[];
      return Response.json(
        rows.map((row) => ({ ...JSON.parse(row.data), isFavorited: true })),
      );
    }
    if (path[0] === "servers" && path[1] === "favorites" && path[2]) {
      const id = path[2] === "check" ? path[3] : path[2];
      if (!id || !getServer(id)) throw new HttpError(404, "Server not found");
      if (method === "POST")
        db.prepare("INSERT OR IGNORE INTO hub_favorites VALUES (?, ?)").run(
          user.id,
          id,
        );
      else if (method === "DELETE")
        db.prepare(
          "DELETE FROM hub_favorites WHERE user_id = ? AND server_id = ?",
        ).run(user.id, id);
      else if (method !== "GET") throw new HttpError(405, "Method not allowed");
      return Response.json({
        isFavorited: !!db
          .prepare(
            "SELECT 1 FROM hub_favorites WHERE user_id = ? AND server_id = ?",
          )
          .get(user.id, id),
        message: "Favorite updated",
      });
    }
    if (route === "servers/my" && method === "GET") {
      const rows = db
        .prepare("SELECT data FROM hub_servers WHERE owner_id = ?")
        .all(user.id) as { data: string }[];
      return Response.json({
        page: 1,
        pageSize: rows.length,
        hasNext: false,
        total: rows.length,
        servers: rows.map((row) => JSON.parse(row.data)),
      });
    }
    if (route === "servers" && method === "POST") {
      const pending = db
        .prepare(
          "SELECT count(*) AS count FROM hub_servers WHERE owner_id = ? AND status = 'pending'",
        )
        .get(user.id) as { count: number };
      if (pending.count >= 10)
        throw new HttpError(429, "Pending submission limit reached");
      const recent = db
        .prepare(
          "SELECT count(*) AS count FROM hub_events WHERE kind = 'server-submission' AND json_extract(data, '$.userId') = ? AND created_at > ?",
        )
        .get(user.id, new Date(Date.now() - 86400000).toISOString()) as {
        count: number;
      };
      if (recent.count >= 5)
        throw new HttpError(429, "Daily submission limit reached");
      const body = await readBody(request);
      const name = textField(body, "name", 100);
      const developer = textField(body, "developer", 100);
      const source = textField(body, "source", 1000);
      let sourceUrl: URL;
      try {
        sourceUrl = new URL(source);
      } catch {
        throw new HttpError(400, "Invalid source URL");
      }
      if (sourceUrl.protocol !== "https:")
        throw new HttpError(400, "Source must use HTTPS");
      const cat = textField(body, "cat", 100);
      if (!cats.includes(cat)) throw new HttpError(400, "Unknown category");
      if (
        !/^[a-zA-Z0-9_.-]+$/.test(name) ||
        !/^[a-zA-Z0-9_.-]+$/.test(developer)
      )
        throw new HttpError(
          400,
          "Name and developer must use repository identifier characters",
        );
      const id = randomUUID();
      const now = new Date().toISOString();
      const server = {
        id,
        name,
        developer,
        qualifiedName: `${developer}/${name}`,
        description: textField(body, "description", 5000),
        source,
        cat,
        tags: Array.isArray(body.tags)
          ? body.tags
              .filter((tag) => typeof tag === "string" && tag.length <= 80)
              .slice(0, 20)
          : [],
        isOfficial: false,
        rating: 0,
        githubStars: 0,
        downloads: 0,
        views: 0,
        isFavorited: false,
        createdAt: now,
        updatedAt: now,
        status: "pending",
        serverConfigs: [],
      };
      db.prepare("INSERT INTO hub_servers VALUES (?, ?, ?, 'pending', ?)").run(
        id,
        server.qualifiedName,
        user.id,
        JSON.stringify(server),
      );
      db.prepare(
        "INSERT INTO hub_events VALUES (?, 'server-submission', ?, ?)",
      ).run(
        randomUUID(),
        JSON.stringify({
          serverId: id,
          userId: user.id,
          configCount: Array.isArray(body.configs) ? body.configs.length : 0,
        }),
        now,
      );
      return Response.json(server, { status: 201 });
    }
    if (
      path[0] === "servers" &&
      path.length === 2 &&
      ["PUT", "PATCH", "DELETE"].includes(method)
    ) {
      const row = db
        .prepare("SELECT data FROM hub_servers WHERE id = ? AND owner_id = ?")
        .get(path[1], user.id) as { data: string } | undefined;
      if (!row) throw new HttpError(404, "Server not found");
      if (method === "DELETE") {
        db.prepare("DELETE FROM hub_servers WHERE id = ? AND owner_id = ?").run(
          path[1],
          user.id,
        );
        return new Response(null, { status: 204 });
      }
      const body = await readBody(request);
      const server = JSON.parse(row.data);
      if (body.description !== undefined)
        server.description = textField(body, "description", 5000);
      if (body.cat !== undefined) {
        const cat = textField(body, "cat", 100);
        if (!cats.includes(cat)) throw new HttpError(400, "Unknown category");
        server.cat = cat;
      }
      server.updatedAt = new Date().toISOString();
      server.status = "pending";
      db.prepare(
        "UPDATE hub_servers SET data = ?, status = 'pending' WHERE id = ? AND owner_id = ?",
      ).run(JSON.stringify(server), path[1], user.id);
      return Response.json(server);
    }
    if (path[0] === "user-server-configs") {
      const id = path[1];
      if (id === "batch-sync")
        throw new HttpError(501, "Batch sync is not yet available");
      if (method === "GET") {
        if (id) {
          const config = db
            .prepare("SELECT * FROM hub_configs WHERE id = ? AND user_id = ?")
            .get(id, user.id);
          if (!config) throw new HttpError(404, "Configuration not found");
          return Response.json(config);
        }
        const name = query.get("server_name");
        const configs = db
          .prepare(
            "SELECT * FROM hub_configs WHERE user_id = ? AND (? IS NULL OR server_name = ?) ORDER BY created_at DESC LIMIT 100",
          )
          .all(user.id, name, name);
        return Response.json({ configs, total: configs.length });
      }
      if (method === "DELETE") {
        const result = id
          ? db
              .prepare("DELETE FROM hub_configs WHERE id = ? AND user_id = ?")
              .run(id, user.id)
          : db
              .prepare("DELETE FROM hub_configs WHERE user_id = ?")
              .run(user.id);
        if (id && !result.changes)
          throw new HttpError(404, "Configuration not found");
        return new Response(null, { status: 204 });
      }
      const body = await readBody(request);
      const existing = id
        ? (db
            .prepare("SELECT * FROM hub_configs WHERE id = ? AND user_id = ?")
            .get(id, user.id) as
            | { server_name: string; encrypt_config_data: string }
            | undefined)
        : undefined;
      if (id && !existing) throw new HttpError(404, "Configuration not found");
      const serverName =
        body.server_name === undefined && existing
          ? existing.server_name
          : textField(body, "server_name", 200);
      const encrypted =
        body.encrypt_config_data === undefined && existing
          ? existing.encrypt_config_data
          : textField(body, "encrypt_config_data", 50000);
      const now = new Date().toISOString();
      if (method === "POST" && !id) {
        const configId = randomUUID();
        db.prepare("INSERT INTO hub_configs VALUES (?, ?, ?, ?, ?, ?)").run(
          configId,
          user.id,
          serverName,
          encrypted,
          now,
          now,
        );
        return Response.json(
          db.prepare("SELECT * FROM hub_configs WHERE id = ?").get(configId),
          { status: 201 },
        );
      }
      if (method === "PUT" && id) {
        const result = db
          .prepare(
            "UPDATE hub_configs SET server_name = ?, encrypt_config_data = ?, updated_at = ? WHERE id = ? AND user_id = ?",
          )
          .run(serverName, encrypted, now, id, user.id);
        if (!result.changes)
          throw new HttpError(404, "Configuration not found");
        return Response.json(
          db
            .prepare("SELECT * FROM hub_configs WHERE id = ? AND user_id = ?")
            .get(id, user.id),
        );
      }
    }
    throw new HttpError(404, "Endpoint not found");
  } catch (error) {
    return errorResponse(error);
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
