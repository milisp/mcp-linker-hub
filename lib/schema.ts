// schema/index.ts
import { z } from "zod";

export const SseConfigSchema = z.object({
  type: z.literal("http").or(z.literal("sse")),
  url: z.string().url(),
});

export const StdioServerConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  env: z.record(z.any()).optional(),
});

export const ServerConfigSchema = z.union([
  SseConfigSchema,
  StdioServerConfigSchema,
]);

export const McpServersSchema = z.record(ServerConfigSchema).refine(
  (data) => {
    // Ensure at least one server is configured
    if (Object.keys(data).length === 0) {
      return true; // Allow empty object for now
    }

    // Validate each server configuration
    for (const [serverName, config] of Object.entries(data)) {
      if (!config || typeof config !== "object") {
        return false;
      }

      // Check if it's a valid SSE/HTTP or stdio config
      if (
        "type" in config &&
        (config.type === "http" || config.type === "sse")
      ) {
        if (!("url" in config) || typeof config.url !== "string") {
          return false;
        }
      } else {
        if (!("command" in config) || typeof config.command !== "string") {
          return false;
        }
        if (!("args" in config) || !Array.isArray(config.args)) {
          return false;
        }
      }
    }
    return true;
  },
  {
    message:
      "Invalid MCP server configuration. Each server must have proper structure.",
  },
);

// Support both direct format and wrapped format
export const FlexibleMcpServersSchema = z.union([
  McpServersSchema,
  z
    .object({
      mcpServers: McpServersSchema,
    })
    .transform((data) => data.mcpServers),
]);

export type SseConfig = z.infer<typeof SseConfigSchema>;
export type StdioServerConfig = z.infer<typeof StdioServerConfigSchema>;
export type ServerConfigType = z.infer<typeof ServerConfigSchema>;
export type McpServersType = z.infer<typeof McpServersSchema>;
