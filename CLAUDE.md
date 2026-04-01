# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server (Next.js on port 3000)
bun run build     # Production build
bun run lint      # ESLint via Next.js
```

No test suite is configured.

## Environment

Copy `.env.local.example` to `.env.local`. Key variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000        # Backend REST API
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_POLAR_ENVIRONMENT=sandbox            # "sandbox" | "production"
POLAR_SUCCESS_URL=http://localhost:3000/success?checkout_id={CHECKOUT_ID}
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (auth), Polar.sh (payments), SWR (data fetching), Zustand (client state), Radix UI / shadcn components.

### What the app does

MCP Linker Hub is a marketplace for discovering and managing MCP (Model Context Protocol) servers across AI clients (Claude Desktop, Cursor, VS Code, Windsurf, etc.). Feature access is gated by subscription tier.

### Key layers

| Layer | Location | Notes |
|---|---|---|
| Pages / Routes | `app/` | App Router; SSR initial data, then client hydration |
| UI Components | `components/` | Organized by `layout/`, `auth/`, `features/`, `sections/`, `tiers/`, `ui/` |
| API client | `lib/api/` | Axios wrapper; `index.ts` base, `servers.ts` server endpoints, `user-api.tsx` user endpoints |
| Data hooks | `hooks/` | SWR-based (`use-servers.ts`); auth-aware via `useAuthedApi.ts` |
| State | `stores/` | Zustand — currently favorites store only |
| Plans / tiers | `lib/plans.ts`, `lib/client-tiers.ts` | Subscription plan definitions and per-tier feature access matrix |

### Auth flow

`SupabaseProvider` (`components/providers/supabase-provider.tsx`) wraps the app and manages session state. It exposes `getAccessToken()` used by `useAuthedApi` to inject `Authorization: Bearer <token>` headers. Tokens auto-refresh 5 minutes before expiry. OAuth providers: Google, GitHub, Discord.

### Subscription / tier system

`lib/client-tiers.ts` defines `UserTier` (FREE, PRO, TEAM, LIFETIME_BASIC, LIFETIME_PRO) and `ClientComplexity` (simple / medium / complex / custom). The `TIER_ACCESS` matrix determines which AI clients each tier can configure:

- **FREE** → simple clients only (Claude Desktop, Windsurf, CherryStudio, Plux)
- **LIFETIME_BASIC** → simple + medium + custom
- **LIFETIME_PRO / PRO / TEAM** → all clients including complex (Codex TOML, Claude Code multi-method)

Use `canAccessClient()`, `getAccessibleClients()`, `canUseLocalSync()`, `canUseCloudSync()` for access checks.

### Data fetching pattern

SSR pages fetch initial data (revalidated at 300 s for lists, 600 s for details), then pass it to `*Client` components that use SWR for pagination and live updates. Search/category filters reset pagination and re-fetch.

### Payments

Polar.sh handles checkout. Plan/price IDs and checkout URLs live in `lib/plans.ts`. Toggle sandbox vs. production via `NEXT_PUBLIC_POLAR_ENVIRONMENT`.
