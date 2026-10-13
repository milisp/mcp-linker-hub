import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { appDeepLink, loadCatalog, toCatalogServer } from "../src/lib/catalog";
import type { RegistryServer } from "../src/lib/registry";

const dir =
  process.env.MCP_SERVERS_DIR ??
  fileURLToPath(new URL("../../mcp-servers", import.meta.url));
const hasCatalog = existsSync(`${dir}/index.json`);
if (!hasCatalog) {
  console.warn(
    `Skipping catalog loading test: no checkout at ${dir}. Set MCP_SERVERS_DIR.`,
  );
}

describe("loadCatalog", () => {
  test.skipIf(!hasCatalog)(
    "loads the local catalog in index order",
    async () => {
      const index = (await Bun.file(`${dir}/index.json`).json()) as {
        servers: string[];
        collections?: string[];
      };
      const catalog = await loadCatalog({ MCP_SERVERS_DIR: dir });
      expect(catalog.servers.map((s) => s.id)).toEqual(index.servers);
      for (const server of catalog.servers) {
        expect(server.iconUrl).toBeTruthy();
        expect(catalog.categories).toContain(server.category);
        expect(server.configs.length).toBeGreaterThanOrEqual(1);
      }
      expect(catalog.collections.map((c) => c.id)).toEqual(
        index.collections ?? [],
      );
      for (const collection of catalog.collections) {
        expect(collection.servers.length).toBeGreaterThanOrEqual(2);
      }
    },
  );
});

describe("toCatalogServer", () => {
  test("npm package with an env var", () => {
    const server = toCatalogServer("demo", {
      name: "io.example/demo",
      description: "Demo",
      version: "1.0.0",
      packages: [
        {
          registryType: "npm",
          identifier: "@example/demo-mcp",
          transport: { type: "stdio" },
          environmentVariables: [
            { name: "API_KEY", isRequired: true, isSecret: true },
          ],
        },
      ],
    } as RegistryServer);
    expect(server.configs[0]).toEqual({
      type: "stdio",
      command: "npx",
      args: ["-y", "@example/demo-mcp"],
      env: { API_KEY: "<API_KEY>" },
    });
  });

  test("streamable-http remote", () => {
    const server = toCatalogServer("remote", {
      name: "io.example/remote",
      description: "Remote",
      version: "1.0.0",
      remotes: [{ type: "streamable-http", url: "https://example.com/mcp" }],
    } as RegistryServer);
    expect(server.configs[0]).toEqual({
      type: "http",
      url: "https://example.com/mcp",
    });
  });
});

test("appDeepLink encodes the slash in the registry name", () => {
  expect(appDeepLink({ registryName: "io.github.milisp/demo" })).toBe(
    "mcp-linker://servers/io.github.milisp%2Fdemo",
  );
});
