import { cats } from "@/lib/data";

export type CategoryName = "All" | (typeof cats)[number];

// Define categories array with type safety
export const CATEGORIES: CategoryName[] = ["All", ...cats];

export type SseConfig = {
  type: "http" | "sse";
  url: string;
};

// Type for stdio server
export type StdioServerConfig = {
  command: string;
  args: string[];
  env?: Record<string, any>;
};

export type ServerConfigType = SseConfig | StdioServerConfig;

export type McpServersType = Record<string, ServerConfigType>;

export interface MCPServerCreate {
  name: string;
  developer: string;
  description: string;
  tags: string[];
  projectUrl?: string;
  category: CategoryName;
  logoUrl?: string;
  mcpServers: McpServersType;
}
