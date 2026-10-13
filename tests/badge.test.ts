import { describe, expect, test } from "bun:test";
import {
  buildDeepLink,
  buildHtml,
  buildInstallUrl,
  buildMarkdown,
  decodeConfig,
  encodeConfig,
  parseServerInput,
  repoUrl,
} from "../src/lib/badge";

describe("config encoding", () => {
  test("round-trips ASCII and non-ASCII", () => {
    const config = {
      command: "npx",
      args: ["-y", "pkg"],
      note: "héllo 日本語 🚀",
    };
    expect(decodeConfig(encodeConfig(config))).toEqual(config);
  });

  test("tolerates + turned into spaces and base64url", () => {
    const config = { command: "x", args: ["??>>"] };
    const encoded = encodeConfig(config);
    expect(decodeConfig(encoded.replaceAll("+", " "))).toEqual(config);
    expect(
      decodeConfig(encoded.replaceAll("+", "-").replaceAll("/", "_")),
    ).toEqual(config);
  });

  test("returns undefined for garbage", () => {
    expect(decodeConfig("not base64 !!")).toBeUndefined();
    expect(decodeConfig(btoa("not json"))).toBeUndefined();
  });
});

describe("parseServerInput", () => {
  test("mcpServers wrapper", () => {
    const result = parseServerInput(
      JSON.stringify({ mcpServers: { fs: { command: "npx", args: [] } } }),
    );
    expect(result).toEqual({
      name: "fs",
      config: { command: "npx", args: [] },
    });
  });

  test("bare name map with url", () => {
    const result = parseServerInput(
      JSON.stringify({ remote: { url: "https://example.com/mcp" } }),
    );
    expect(result).toEqual({
      name: "remote",
      config: { url: "https://example.com/mcp" },
    });
  });

  test("errors on invalid JSON", () => {
    expect("error" in parseServerInput("{nope")).toBe(true);
  });

  test("errors when no server has command or url", () => {
    expect("error" in parseServerInput(JSON.stringify({ a: { foo: 1 } }))).toBe(
      true,
    );
    expect("error" in parseServerInput(JSON.stringify([1]))).toBe(true);
  });
});

describe("links", () => {
  const server = { name: "my server/é", config: { command: "npx" } };

  test("install URL encodes name and config", () => {
    const url = new URL(buildInstallUrl("https://example.dev/", server));
    expect(url.pathname).toBe("/install-app");
    expect(url.searchParams.get("name")).toBe("my server/é");
    expect(url.search).toContain("name=my%20server%2F%C3%A9");
    expect(decodeConfig(url.searchParams.get("config") ?? "")).toEqual(
      server.config,
    );
  });

  test("markdown and html", () => {
    const url = "https://example.dev/install-app?name=a&config=b";
    expect(buildMarkdown(url)).toBe(
      `[![Add to MCP Linker](https://img.shields.io/badge/MCP_Linker-Add-4f46e5?style=for-the-badge)](${url})`,
    );
    expect(buildHtml(url)).toContain("name=a&amp;config=b");
  });

  test("deep link", () => {
    expect(buildDeepLink("a b", "x+y=")).toBe(
      "mcp-linker://install-app?name=a%20b&config=x%2By%3D",
    );
  });

  test("repoUrl only accepts owner/name", () => {
    expect(repoUrl("milisp/mcp-linker")).toBe(
      "https://github.com/milisp/mcp-linker",
    );
    expect(repoUrl("javascript:alert(1)")).toBeUndefined();
    expect(repoUrl("a/b/c")).toBeUndefined();
  });
});
