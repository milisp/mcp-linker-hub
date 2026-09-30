# MCP Linker Hub

Next.js application for MCP discovery and a managed MCP hosting pilot. The app
includes its own backend, SQLite persistence, Better Auth cookie sessions, and
Polar checkout with signature-verified local entitlement caching. It does not
require Supabase or the retired `mcp-linker-api` service.

## Development

```sh
bun install
cp .env.example .env.local
# Set BETTER_AUTH_SECRET to a unique random value.
bun run dev
```

Use Node.js 22 or newer in production. Next.js uses the Node runtime and
`better-sqlite3`; deploy on a persistent server/container with a writable disk.
The default database is `data/hub.sqlite`. Mount the entire data directory to
preserve the database and WAL files. This deployment is not compatible with an
ephemeral serverless filesystem. Use SQLite's backup API for consistent backups
and test restores. Do not copy only the main database while WAL writes are active.

```sh
bunx tsc --noEmit
bun test --conditions=react-server tests/billing.test.mjs
bun run build
bun run start
```

`bun run build --webpack` is an alternative when the local environment prevents
Turbopack's compiler subprocess from binding a port.

## Authentication and existing data

Set `BETTER_AUTH_URL` to the deployment's public origin and provide a unique
`BETTER_AUTH_SECRET` of at least 32 characters. Optional GitHub/Google OAuth
requires registering the corresponding `/api/auth/callback/github` or
`/api/auth/callback/google` redirect. Password recovery is unavailable until email
delivery is implemented. Existing Supabase users and data are not automatically
migrated; import and account reconciliation require a separate migration.

Catalog pages use the local database. The initial seed contains only the two
existing repository records; it is not a recovered export of the former catalog.
User submissions stay pending and are never executed or published automatically.
Configuration credentials from submissions are discarded. Team collaboration and
batch configuration sync currently return explicit unavailable responses.

## Payments

Polar remains the source of payment records. SQLite stores only customer identity
associations, entitlement state, and webhook deduplication metadata.

1. Set `POLAR_SERVER` (`sandbox` or `production`), `POLAR_ACCESS_TOKEN`, and
   `POLAR_WEBHOOK_SECRET` in server-side environment variables.
2. Set `POLAR_PRODUCTS` to an array of products matching the example in
   `.env.example`. Product IDs and displayed prices must match the actual Polar
   catalog. Only these products can be checked out or grant access.
3. Configure Polar to deliver webhooks to `/api/webhooks/polar` using API version
   `2026-04`. Enable subscription lifecycle events (`created`, `updated`, `active`,
   `canceled`, `uncanceled`, `revoked`, `past_due`, `paused`, `resumed`) and order
   lifecycle events (`created`, `updated`, `paid`, `refunded`).
4. Test sandbox checkout, webhook delivery, cancellation, and refunds before
   accepting live payments.

Checkout uses the signed-in user's ID as Polar's external customer ID. Clients
cannot supply another customer's identity. Returning to `/success` does not grant
access; verified webhook state controls access. Canceled subscriptions retain
access until their period end; revoked/expired subscriptions lose access. Any
refund revokes a one-time entitlement. Legacy purchases and identities need
explicit reconciliation; they are not linked by an unverified email address.

## Managed MCP pilot

Configure operator-owned, audited HTTPS endpoints in `HOSTED_MCP_SERVICES` and
place each upstream Bearer credential in the environment variable referenced by
`tokenEnv`. `reviewReference` records an operator review; it is not an automatic
scanner approval. Secrets stay on the server. Never grant an unreviewed server
production credentials.

Users manage hashed, revocable, 90-day access keys at `/hosting`. Clients connect
to `/mcp/<service-id>` using `Authorization: Bearer <access-key>`. An active Polar
entitlement is required. All keys share the user's daily request allowance and a
20-request-per-minute cap. Allowances count protocol requests, not just tool calls;
upstream failures can consume allowance. Multiple plans use the highest allowance,
not the sum. Limits use UTC calendar days.

The pilot forwards POST requests to **stateless** Streamable HTTP servers only,
with a 256 KiB input cap, 30-second upstream timeout, and redirects disabled. GET,
session-based services, arbitrary user-provided URLs, and stdio/container execution
are not supported. Upstream sessions are rejected to avoid sharing another user's
session. This gateway does not automatically isolate data held by an upstream
shared account: only expose services reviewed for that access model.

No hosted services or paid plans are enabled until configured. Runtime container
isolation, broader upstream authentication methods, and automated deployment
approval are separate work.

## Security scanning

The offline Cisco MCP Scanner integration exports reproducible JSON evidence and
fails on findings, missing input, skipped analysis, or analyzer errors. See
[the scanning guide](docs/mcp-security.md). Metadata scanning does not replace
source review, dependency scanning, runtime isolation, or authorization checks.
No catalog server is labeled as scanned merely because it appears in the directory.
