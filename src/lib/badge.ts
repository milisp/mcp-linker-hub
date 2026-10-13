export interface BadgeServer {
  name: string;
  config: Record<string, unknown>;
}

export type ParseResult = BadgeServer | { error: string };

const BADGE_IMAGE =
  "https://img.shields.io/badge/MCP_Linker-Add-4f46e5?style=for-the-badge";
const BADGE_ALT = "Add to MCP Linker";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isServerConfig(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    (typeof value.command === "string" || typeof value.url === "string")
  );
}

/** Accepts `{ mcpServers: { name: config } }` or `{ name: config }`. */
export function parseServerInput(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { error: "That is not valid JSON." };
  }
  if (!isRecord(json)) return { error: "Expected a JSON object." };
  const servers = isRecord(json.mcpServers) ? json.mcpServers : json;
  for (const [name, config] of Object.entries(servers)) {
    if (isServerConfig(config)) return { name, config };
  }
  return {
    error: 'No server found. Each server needs a "command" or a "url".',
  };
}

export function encodeConfig(config: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(config));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Returns the config JSON, or undefined when the value is not valid. */
export function decodeConfig(encoded: string): unknown | undefined {
  try {
    // A "+" in a query string arrives as a space; base64url uses - and _.
    const base64 = encoded
      .replaceAll(" ", "+")
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return undefined;
  }
}

export function buildInstallUrl(origin: string, server: BadgeServer): string {
  const name = encodeURIComponent(server.name);
  const config = encodeURIComponent(encodeConfig(server.config));
  return `${origin.replace(/\/$/, "")}/install-app?name=${name}&config=${config}`;
}

export function buildDeepLink(name: string, config: string): string {
  return `mcp-linker://install-app?name=${encodeURIComponent(name)}&config=${encodeURIComponent(config)}`;
}

export function buildMarkdown(installUrl: string): string {
  return `[![${BADGE_ALT}](${BADGE_IMAGE})](${installUrl})`;
}

export function buildHtml(installUrl: string): string {
  return `<a href="${installUrl.replaceAll("&", "&amp;")}"><img src="${BADGE_IMAGE}" alt="${BADGE_ALT}"></a>`;
}

export function repoUrl(repo: string): string | undefined {
  return /^[\w.-]+\/[\w.-]+$/.test(repo)
    ? `https://github.com/${repo}`
    : undefined;
}
