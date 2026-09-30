import { expect, test } from "bun:test";
import { createHmac } from "node:crypto";
process.env.DATABASE_PATH = ":memory:";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.BETTER_AUTH_SECRET = "test-billing-secret-32-characters-minimum";
process.env.POLAR_WEBHOOK_SECRET = "test-webhook-secret";
process.env.POLAR_PRODUCTS = JSON.stringify([
  {
    slug: "pro",
    productId: "pro-product",
    tier: "PRO",
    dailyRequestLimit: 100,
    name: "Pro",
    priceLabel: "$10/month",
    recurring: true,
  },
  {
    slug: "lifetime",
    productId: "once-product",
    tier: "PRO",
    dailyRequestLimit: 50,
    name: "Lifetime",
    priceLabel: "$50",
    recurring: false,
  },
]);
const { initializeAuth } = await import(process.cwd() + "/lib/server/auth.ts");
const { db } = await import(process.cwd() + "/lib/server/db.ts");
const { applyVerifiedBillingEvent, getHostedDailyLimit } = await import(
  process.cwd() + "/lib/server/billing.ts"
);
const { POST } = await import(
  process.cwd() + "/app/api/webhooks/polar/route.ts"
);
await initializeAuth();
db.prepare(
  'INSERT INTO "user" (id,name,email,emailVerified,createdAt,updatedAt) VALUES (?,?,?,?,?,?)',
).run("u1", "Test", "u1@example.com", 0, Date.now(), Date.now());
const now = Date.now();
function event(id, type, changed, fields = {}) {
  return {
    type,
    timestamp: new Date(changed).toISOString(),
    data: {
      id,
      customer_id: "c1",
      product_id: "pro-product",
      customer: { external_id: "u1" },
      status: "active",
      current_period_end: new Date(now + 60000).toISOString(),
      modified_at: new Date(changed).toISOString(),
      ...fields,
    },
  };
}
test("active, cancellation, revocation, replay and older delivery", () => {
  applyVerifiedBillingEvent("e1", event("s1", "subscription.active", now));
  expect(getHostedDailyLimit("u1")).toBe(100);
  applyVerifiedBillingEvent(
    "e2",
    event("s1", "subscription.canceled", now + 1000, {
      cancel_at_period_end: true,
    }),
  );
  expect(getHostedDailyLimit("u1")).toBe(100);
  applyVerifiedBillingEvent(
    "e3",
    event("s1", "subscription.revoked", now + 2000),
  );
  expect(getHostedDailyLimit("u1")).toBe(0);
  applyVerifiedBillingEvent(
    "e4",
    event("s1", "subscription.active", now + 1000),
  );
  applyVerifiedBillingEvent(
    "e3",
    event("s1", "subscription.active", now + 4000),
  );
  expect(getHostedDailyLimit("u1")).toBe(0);
});
test("expiry, unknown product and another account never grant", () => {
  applyVerifiedBillingEvent(
    "e5",
    event("s2", "subscription.active", now, {
      current_period_end: new Date(now - 1).toISOString(),
    }),
  );
  applyVerifiedBillingEvent(
    "e6",
    event("s3", "subscription.active", now, { product_id: "unknown" }),
  );
  expect(getHostedDailyLimit("u1")).toBe(0);
  expect(getHostedDailyLimit("u2")).toBe(0);
});
test("one-time paid and refunded with old retry", () => {
  applyVerifiedBillingEvent(
    "o1",
    event("order1", "order.paid", now, {
      product_id: "once-product",
      status: "paid",
      paid: true,
    }),
  );
  expect(getHostedDailyLimit("u1")).toBe(50);
  applyVerifiedBillingEvent(
    "o2",
    event("order1", "order.refunded", now + 1000, {
      product_id: "once-product",
      status: "refunded",
      paid: true,
      refunded_amount: 5000,
    }),
  );
  applyVerifiedBillingEvent(
    "o3",
    event("order1", "order.paid", now, {
      product_id: "once-product",
      status: "paid",
      paid: true,
    }),
  );
  expect(getHostedDailyLimit("u1")).toBe(0);
});
test("invalid signature is rejected, valid signed event grants and replay is idempotent", async () => {
  const invalid = await POST(
    new Request("http://localhost:3000/api/webhooks/polar", {
      method: "POST",
      body: "{}",
    }),
  );
  expect(invalid.status).toBe(403);
  const staleTimestamp = String(Math.floor(Date.now() / 1000) - 600);
  const staleSignature = createHmac("sha256", process.env.POLAR_WEBHOOK_SECRET)
    .update(`stale.${staleTimestamp}.{}`)
    .digest("base64");
  expect(
    (
      await POST(
        new Request("http://localhost:3000/api/webhooks/polar", {
          method: "POST",
          body: "{}",
          headers: {
            "webhook-id": "stale",
            "webhook-timestamp": staleTimestamp,
            "webhook-signature": `v1,${staleSignature}`,
          },
        }),
      )
    ).status,
  ).toBe(403);
  const body = JSON.stringify(
    event("signed-sub", "subscription.active", now + 10000),
  );
  const timestamp = String(Math.floor(Date.now() / 1000));
  const id = "signed-event";
  const signature = createHmac("sha256", process.env.POLAR_WEBHOOK_SECRET)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  const request = () =>
    new Request("http://localhost:3000/api/webhooks/polar", {
      method: "POST",
      body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": `v1,${signature}`,
      },
    });
  expect((await POST(request())).status).toBe(200);
  expect((await POST(request())).status).toBe(200);
  expect(getHostedDailyLimit("u1")).toBe(100);
  expect(
    db.prepare("SELECT count(*) AS n FROM hub_polar_events WHERE id=?").get(id)
      .n,
  ).toBe(1);
});

test("hosted keys are hashed, owner-scoped and revocable; limits cannot be bypassed with another key", async () => {
  const { issueKey, authorizeHosted, revokeKey, reserveRequest } = await import(
    process.cwd() + "/lib/server/hosting.ts"
  );
  const first = issueKey("u1"),
    second = issueKey("u1");
  const request = (token) =>
    new Request("http://localhost:3000/mcp/test", {
      headers: { Authorization: `Bearer ${token}` },
    });
  expect(authorizeHosted(request(first.token))).toBe("u1");
  expect(
    db.prepare("SELECT token_hash FROM hosted_keys WHERE id=?").get(first.id)
      .token_hash,
  ).not.toBe(first.token);
  expect(revokeKey("u2", first.id)).toBe(false);
  expect(revokeKey("u1", first.id)).toBe(true);
  expect(authorizeHosted(request(first.token))).toBeNull();
  expect(authorizeHosted(request(second.token))).toBe("u1");
  for (let i = 0; i < 20; i++) expect(reserveRequest("u1")).toBe(true);
  expect(reserveRequest("u1")).toBe(false);
  db.prepare("UPDATE hosted_usage SET requests=100 WHERE user_id=?").run("u1");
  db.prepare("DELETE FROM hosted_rate WHERE user_id=?").run("u1");
  expect(reserveRequest("u1")).toBe(false);
  expect(reserveRequest("u2")).toBe(false);
});
