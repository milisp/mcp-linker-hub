# MCP Linker Hub

The website for [MCP Linker](https://github.com/milisp/mcp-linker). A static Astro site with:

- Home page and a server catalog loaded at build time from [milisp/mcp-servers](https://github.com/milisp/mcp-servers).
- Pricing page linking to Polar checkout, plus a `/success` page for after checkout.
- Privacy page.
- `/install-app` for existing README badges (`/install-app?name=...&config=...`), and a badge maker when opened without parameters.

There is no backend, no accounts, and no database.

## Commands

```sh
bun install
MCP_SERVERS_DIR=../mcp-servers bun run dev
bun run build
bun run preview
bun run typecheck
bun test
bun run lint
```

`bun test` runs the catalog loading test only when a catalog checkout is found (`../mcp-servers` or `MCP_SERVERS_DIR`).

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public site URL for the sitemap and canonical links |
| `MCP_SERVERS_DIR` | Local catalog checkout; otherwise fetched from GitHub |
| `MCP_SERVERS_REF` | Catalog branch, tag, or commit to fetch |
| `PUBLIC_POLAR_CHECKOUT_PERSONAL` | Polar checkout link for Plus (formerly Personal) |
| `PUBLIC_POLAR_CHECKOUT_COMMERCIAL` | Polar checkout link for Pro (variable keeps its old name) |
| `PUBLIC_EARLY_BIRD` | `false` shows regular prices |

## Deploy (Vercel)

Vercel builds from GitHub using `vercel.json` (Astro preset, `bun run build`, `dist/`, clean URLs). Set the variables above in the Vercel project and remove the old Next.js ones (`BETTER_AUTH_*`, `POLAR_ACCESS_TOKEN`, `DATABASE_PATH`, and so on).

The catalog is fetched at build time from the latest `mcp-servers` commit, so the site must be rebuilt after a catalog merge. Create a Deploy Hook in the Vercel project (Settings → Git → Deploy Hooks) and save its URL as the `VERCEL_DEPLOY_HOOK_URL` secret in `milisp/mcp-servers`; its `deploy-hub` workflow calls the hook on every catalog change.

## Polar setup

1. Create Plus and Pro one-time products with the License Key benefit.
2. Create a checkout link for each and set the environment variables above.
3. Set each checkout's success URL to `<site>/success`.

Prices in `src/lib/pricing.ts` must match the Polar products.

## TypeScript 7

`astro check` does not support TypeScript 7. `tsc --noEmit` checks `.ts` files only, so logic lives in `src/lib/*.ts` and `.astro` files stay thin.
