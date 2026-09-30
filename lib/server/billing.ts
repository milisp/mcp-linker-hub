import "server-only";
import { createPolar } from "@polar-sh/sdk/2026-04";
import { db } from "./db";

export interface BillingProduct {
  slug: string;
  productId: string;
  tier: string;
  dailyRequestLimit: number;
  name: string;
  priceLabel: string;
  recurring: boolean;
}
export function getBillingProducts(): BillingProduct[] {
  if (!process.env.POLAR_PRODUCTS) return [];
  const products: unknown = JSON.parse(process.env.POLAR_PRODUCTS);
  if (!Array.isArray(products))
    throw new Error("POLAR_PRODUCTS must be an array");
  const slugs = new Set<string>();
  const ids = new Set<string>();
  return products.map((value: unknown) => {
    const p = value as BillingProduct;
    if (
      !p ||
      ![p.slug, p.productId, p.tier, p.name, p.priceLabel].every(
        (v) => typeof v === "string" && v.length > 0 && v.length <= 200,
      ) ||
      !/^[a-z0-9-]+$/.test(p.slug) ||
      !Number.isSafeInteger(p.dailyRequestLimit) ||
      p.dailyRequestLimit < 1 ||
      typeof p.recurring !== "boolean" ||
      slugs.has(p.slug) ||
      ids.has(p.productId)
    )
      throw new Error("Invalid or duplicate POLAR_PRODUCTS entry");
    slugs.add(p.slug);
    ids.add(p.productId);
    return {
      slug: p.slug,
      productId: p.productId,
      tier: p.tier,
      dailyRequestLimit: p.dailyRequestLimit,
      name: p.name,
      priceLabel: p.priceLabel,
      recurring: p.recurring,
    };
  });
}
export function getPolar() {
  if (!process.env.POLAR_ACCESS_TOKEN)
    throw new Error("Polar checkout is not configured");
  return createPolar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    environment:
      process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
  });
}
function initializeBilling() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS hub_polar_customers (customer_id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS hub_polar_entitlements (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, customer_id TEXT NOT NULL, product_id TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL, expires_at INTEGER, version INTEGER NOT NULL, priority INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS hub_polar_entitlements_user ON hub_polar_entitlements(user_id);
    CREATE TABLE IF NOT EXISTS hub_polar_events (id TEXT PRIMARY KEY, received_at INTEGER NOT NULL);
  `);
}
interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  kind: string;
  status: string;
  expires_at: number | null;
}
export function getBillingStatus(userId: string) {
  initializeBilling();
  const products = getBillingProducts();
  const rows = db
    .prepare(
      "SELECT id, user_id, product_id, kind, status, expires_at FROM hub_polar_entitlements WHERE user_id = ?",
    )
    .all(userId) as Entitlement[];
  const entitlements = rows.flatMap((row) => {
    const product = products.find(
      (p) =>
        p.productId === row.product_id &&
        p.recurring === (row.kind === "subscription"),
    );
    if (!product) return [];
    const active =
      ["active", "canceled"].includes(row.status) &&
      (row.expires_at === null
        ? row.kind === "order"
        : row.expires_at > Date.now());
    return [
      {
        plan: product.slug,
        tier: product.tier,
        name: product.name,
        status: row.status,
        active,
        expiresAt:
          row.expires_at === null
            ? null
            : new Date(row.expires_at).toISOString(),
        dailyRequestLimit: active ? product.dailyRequestLimit : 0,
      },
    ];
  });
  return {
    active: entitlements.some((e) => e.active),
    dailyRequestLimit: Math.max(
      0,
      ...entitlements.map((e) => e.dailyRequestLimit),
    ),
    entitlements,
  };
}
export function getHostedDailyLimit(userId: string): number {
  return getBillingStatus(userId).dailyRequestLimit;
}

// Only call this with the SDK's signature-verified payload. No email association is accepted.
export interface BillingEvent {
  type: string;
  timestamp: string;
  data: {
    id: string;
    modified_at?: string | null;
    created_at?: string;
    customer_id?: string;
    product_id?: string;
    status?: string;
    customer?: { id?: string; external_id?: string | null };
    current_period_end?: string | null;
    ends_at?: string | null;
    ended_at?: string | null;
    cancel_at_period_end?: boolean;
    subscription_id?: string | null;
    paid?: boolean;
    refunded_amount?: number;
  };
}
export function applyVerifiedBillingEvent(
  eventId: string,
  event: BillingEvent,
) {
  initializeBilling();
  const products = getBillingProducts();
  db.transaction(() => {
    if (db.prepare("SELECT 1 FROM hub_polar_events WHERE id = ?").get(eventId))
      return;
    const data = event.data;
    const kind = event.type.startsWith("subscription.")
      ? "subscription"
      : event.type.startsWith("order.")
        ? "order"
        : null;
    if (kind && data.customer_id && data.product_id) {
      const known = db
        .prepare(
          "SELECT user_id FROM hub_polar_customers WHERE customer_id = ?",
        )
        .get(data.customer_id) as { user_id: string } | undefined;
      const external_id = data.customer?.external_id;
      let userId = known?.user_id;
      if (
        !userId &&
        external_id &&
        db.prepare('SELECT id FROM "user" WHERE id = ?').get(external_id)
      ) {
        const bound = db
          .prepare(
            "SELECT customer_id FROM hub_polar_customers WHERE user_id = ?",
          )
          .get(external_id) as { customer_id: string } | undefined;
        if (!bound || bound.customer_id === data.customer_id) {
          db.prepare(
            "INSERT OR IGNORE INTO hub_polar_customers VALUES (?, ?)",
          ).run(data.customer_id, external_id);
          userId = external_id;
        }
      }
      // A changed external ID must not reassign an existing customer's access.
      if (userId && (!external_id || external_id === userId)) {
        const product = products.find(
          (p) =>
            p.productId === data.product_id &&
            p.recurring === (kind === "subscription"),
        );
        const version = new Date(data.modified_at ?? event.timestamp).getTime();
        if (!Number.isFinite(version))
          throw new Error("Invalid billing event timestamp");
        let status = "inactive";
        let expires: number | null = null;
        if (kind === "subscription") {
          const end = data.ends_at ?? data.current_period_end;
          expires = end ? new Date(end).getTime() : null;
          if (
            event.type === "subscription.revoked" ||
            data.ended_at ||
            ["unpaid", "incomplete_expired", "paused"].includes(
              data.status || "",
            )
          )
            status = "revoked";
          else if (
            product &&
            ["active", "trialing"].includes(data.status || "")
          )
            status = data.cancel_at_period_end ? "canceled" : "active";
          else if (
            product &&
            data.status === "canceled" &&
            data.cancel_at_period_end
          )
            status = "canceled";
        } else if (!data.subscription_id && product) {
          // Any refund revokes a one-time entitlement; subscription access follows subscription events.
          status =
            event.type === "order.refunded" ||
            (data.refunded_amount ?? 0) > 0 ||
            data.status === "refunded"
              ? "revoked"
              : data.paid && data.status === "paid"
                ? "active"
                : "inactive";
        }
        const priority =
          status === "revoked" ? 3 : status === "inactive" ? 2 : 1;
        db.prepare(`INSERT INTO hub_polar_entitlements VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET product_id = excluded.product_id, status = excluded.status, expires_at = excluded.expires_at, version = excluded.version, priority = excluded.priority
          WHERE excluded.version > hub_polar_entitlements.version OR (excluded.version = hub_polar_entitlements.version AND excluded.priority > hub_polar_entitlements.priority)`).run(
          `${kind}:${data.id}`,
          userId,
          data.customer_id,
          data.product_id,
          kind,
          status,
          expires,
          version,
          priority,
        );
      }
    }
    db.prepare("INSERT INTO hub_polar_events VALUES (?, ?)").run(
      eventId,
      Date.now(),
    );
  })();
}
