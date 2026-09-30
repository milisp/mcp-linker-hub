# Agent guide

Use English for code and documentation, except localization content.

## Commands

- `bun run dev`: Next.js local development.
- `bun run build`: production build; `--webpack` is available for compiler restrictions.
- `bun run lint`: Biome check (repository-wide legacy warnings exist).
- `bunx tsc --noEmit`: TypeScript validation.
- `bun test --conditions=react-server tests/billing.test.mjs`: isolated SQLite billing and access tests.

## Architecture

Next.js App Router is both frontend and backend. SQLite lives in `lib/server/db.ts`;
Better Auth manages cookie sessions in `lib/server/auth.ts`. API clients use
same-origin `/api/v1`; SSR catalog reads use `lib/server/catalog.ts` directly.
Server-only modules must never enter client bundles.

Polar uses authenticated server-side checkout and verified webhooks. Local
entitlements are a cache, not a replacement for Polar payment records. Never
grant access from client-supplied identities, emails, checkout redirects, or
unsigned events. Hosting access keys are hashed and revocable, while operator
upstream credentials remain server-side. Only configured stateless endpoints
are supported. All writes must enforce ownership and appropriate origin checks.

Read README.md and .env.example for configuration, deployment limits, and
features still unavailable. Do not restore the retired Supabase or FastAPI paths.
