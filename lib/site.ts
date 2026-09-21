/**
 * Canonical origin for this deployment. The old mcp-linker.store domain is
 * gone and no longer resolves, so nothing may point at it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcp-linker.milisp.dev";
