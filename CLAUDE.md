# Agent guide

Use English for code and documentation, except localization content.

## Commands

Bun only. Never use npm, npx, or node.

- `bun install`: install dependencies.
- `MCP_SERVERS_DIR=../mcp-servers bun run dev`: local development against a catalog checkout.
- `bun run build`: static build into `dist/`.
- `bunx tsc --noEmit` (or `bun run typecheck`): TypeScript 7 check of `src/**/*.ts` and `tests/**/*.ts` only. `astro check` does not support TS 7, so keep logic in `.ts` files and keep `.astro` files mostly templates.
- `bun test`: unit tests. Set `MCP_SERVERS_DIR` to run the catalog loading test.
- `bun run lint`: Biome check.

## Architecture

Astro static site (`output: "static"`), Tailwind v4. No server code, no
backend, no accounts, no database, no cookies, no analytics. Do not add them.

The server catalog is owned by `milisp/mcp-servers` and fetched at build time
(`src/lib/catalog.ts`). Never add server data to this repository.

The pricing page lists only shipped features. Purchases go through Polar
checkout links only; never grant or unlock anything client-side. The desktop
app activates license keys with Polar directly.

Keep `src/lib/registry.ts` in sync with MCP Linker's
`src/lib/registry/toConfigs.ts`.

Read README.md and `.env.example` for configuration.
