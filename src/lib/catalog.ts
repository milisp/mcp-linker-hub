import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type ClientConfig,
  type RegistryKeyValueInput,
  type RegistryServer,
  registryServerToConfigs,
} from "./registry";

// The catalog lives in github.com/milisp/mcp-servers and is read at build
// time. MCP_SERVERS_DIR points at a local checkout instead, for development.
const REPO = "milisp/mcp-servers";
const META_KEY = "io.github.milisp.mcp-linker";
const PUBLISHER_KEY = "io.modelcontextprotocol.registry/publisher-provided";

export const CATALOG_REPO_URL = `https://github.com/${REPO}`;

interface CatalogIndex {
  categories: string[];
  servers: string[];
  collections?: string[];
}

interface CatalogMeta {
  configName?: string;
  category?: string;
  featured?: boolean;
  fullDescription?: string;
}

export interface CatalogInput {
  name: string;
  description?: string;
  placeholder?: string;
  isSecret: boolean;
  isRequired: boolean;
}

export interface CatalogServer {
  /** File id in the catalog repository, used for the page URL. */
  id: string;
  /** server.json name; the desktop app looks servers up by this. */
  registryName: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  iconUrl?: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  configName: string;
  transports: string[];
  inputs: CatalogInput[];
  configs: ClientConfig[];
  sourceUrl: string;
}

export interface CatalogCollection {
  id: string;
  title: string;
  description: string;
  servers: CatalogServer[];
}

export interface Catalog {
  categories: string[];
  servers: CatalogServer[];
  collections: CatalogCollection[];
}

type Reader = (path: string) => Promise<string>;

function readerFor(env: Record<string, string | undefined>): Reader {
  const dir = env.MCP_SERVERS_DIR;
  if (dir) return (path) => readFile(join(dir, path), "utf8");
  // raw.githubusercontent.com caches a branch for minutes, so a deploy
  // triggered right after a merge resolves the branch to a commit first.
  let commit: Promise<string> | undefined;
  const resolve = async () => {
    const ref = env.MCP_SERVERS_REF ?? "main";
    if (/^[0-9a-f]{40}$/.test(ref)) return ref;
    const url = `https://api.github.com/repos/${REPO}/commits/${encodeURIComponent(ref)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github.sha" },
    });
    if (!res.ok)
      throw new Error(`Catalog ref lookup failed: ${res.status} ${url}`);
    return (await res.text()).trim();
  };
  return async (path) => {
    commit ??= resolve();
    const url = `https://raw.githubusercontent.com/${REPO}/${await commit}/${path}`;
    const res = await fetch(url);
    // A partial catalog must fail the build rather than ship silently.
    if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status} ${url}`);
    return res.text();
  };
}

function toInput(input: RegistryKeyValueInput): CatalogInput {
  return {
    name: input.name,
    description: input.description,
    placeholder: input.placeholder,
    isSecret: input.isSecret === true,
    isRequired: input.isRequired === true,
  };
}

export function toCatalogServer(
  id: string,
  server: RegistryServer,
): CatalogServer {
  const meta = ((server._meta?.[PUBLISHER_KEY] as Record<string, unknown>)?.[
    META_KEY
  ] ?? {}) as CatalogMeta;
  const remotes = server.remotes ?? [];
  const packages = server.packages ?? [];
  const inputs = [
    ...packages.flatMap((p) => p.environmentVariables ?? []),
    ...remotes.flatMap((r) => r.headers ?? []),
  ].filter((input) => input.value === undefined);

  return {
    id,
    registryName: server.name,
    title: server.title ?? id,
    description: meta.fullDescription ?? server.description,
    category: meta.category ?? "Other",
    featured: meta.featured === true,
    iconUrl: server.icons?.[0]?.src,
    websiteUrl: server.websiteUrl,
    repositoryUrl: server.repository?.url,
    configName: meta.configName ?? id,
    transports: [
      ...new Set([
        ...packages.map((p) => p.transport?.type ?? "stdio"),
        ...remotes.map((r) => r.type),
      ]),
    ],
    inputs: inputs.map(toInput),
    configs: registryServerToConfigs(server),
    sourceUrl: `${CATALOG_REPO_URL}/blob/main/servers/${id}.json`,
  };
}

export async function loadCatalog(
  env: Record<string, string | undefined> = process.env,
): Promise<Catalog> {
  const read = readerFor(env);
  const index = JSON.parse(await read("index.json")) as CatalogIndex;
  const servers = await Promise.all(
    index.servers.map(async (id) =>
      toCatalogServer(
        id,
        JSON.parse(await read(`servers/${id}.json`)) as RegistryServer,
      ),
    ),
  );
  const byId = new Map(servers.map((server) => [server.id, server]));
  const collections = await Promise.all(
    (index.collections ?? []).map(async (id) => {
      const data = JSON.parse(await read(`collections/${id}.json`)) as {
        title: string;
        description: string;
        servers: string[];
      };
      return {
        id,
        title: data.title,
        description: data.description,
        // The catalog's own validation guarantees every id exists.
        servers: data.servers.flatMap((serverId) => byId.get(serverId) ?? []),
      };
    }),
  );
  return { categories: index.categories, servers, collections };
}

let cached: Promise<Catalog> | undefined;

/** One fetch per build, shared by every page. */
export function getCatalog(): Promise<Catalog> {
  cached ??= loadCatalog();
  return cached;
}

/** Opens the server's page in the MCP Linker desktop app. */
export function appDeepLink(server: Pick<CatalogServer, "registryName">) {
  return `mcp-linker://servers/${encodeURIComponent(server.registryName)}`;
}

/** README badge linking to the server's page on this site. */
export function badgeMarkdown(
  site: URL | string,
  server: Pick<CatalogServer, "id">,
) {
  const page = new URL(`/servers/${server.id}`, site);
  return `[![Add to MCP Linker](https://img.shields.io/badge/MCP_Linker-Add-4f46e5?style=for-the-badge)](${page})`;
}

/** The `mcpServers` JSON most clients accept, for manual setup. */
export function configSnippet(server: CatalogServer, config: ClientConfig) {
  return JSON.stringify(
    { mcpServers: { [server.configName]: config } },
    null,
    2,
  );
}
