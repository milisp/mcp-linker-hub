// Client access control based on user tier
// Defines which AI clients are available for each subscription tier

export type UserTier = "FREE" | "LIFETIME_BASIC" | "LIFETIME_PRO" | "PRO" | "TEAM";

export type ClientName =
  | "claude"           // Claude Desktop
  | "claude_code"      // Claude Code (complex: 3 config methods)
  | "cursor"           // Cursor
  | "vscode"           // VS Code
  | "cline"            // Cline
  | "roo_code"         // Roo Code
  | "windsurf"         // Windsurf
  | "cherrystudio"     // CherryStudio
  | "plux"             // Plux
  | "codex"            // Codex (complex: TOML format)
  | "mcphub"           // MCP Hub
  | "mcplinker"        // MCP Linker
  | "custom";          // Custom client

// Client complexity tiers
export const CLIENT_COMPLEXITY = {
  // Simple: Global JSON configuration
  simple: ["claude", "windsurf", "cherrystudio", "plux"] as const,

  // Medium: Project-level JSON configuration
  medium: ["cursor", "vscode", "cline", "roo_code", "mcphub", "mcplinker"] as const,

  // Complex: TOML format or multiple config methods
  complex: ["codex", "claude_code"] as const,

  // Custom: User-defined paths
  custom: ["custom"] as const,
} as const;

// Access matrix: which tiers can access which client complexities
export const TIER_ACCESS = {
  FREE: {
    simple: true,
    medium: false,
    complex: false,
    custom: false,
  },
  LIFETIME_BASIC: {
    simple: true,
    medium: true,
    complex: false,
    custom: true,
  },
  LIFETIME_PRO: {
    simple: true,
    medium: true,
    complex: true,
    custom: true,
  },
  PRO: {
    simple: true,
    medium: true,
    complex: true,
    custom: true,
  },
  TEAM: {
    simple: true,
    medium: true,
    complex: true,
    custom: true,
  },
} as const;

/**
 * Check if a user tier can access a specific client
 * @param userTier - The user's subscription tier
 * @param clientName - The client name to check
 * @returns boolean - Whether the user can access this client
 */
export function canAccessClient(userTier: UserTier, clientName: ClientName): boolean {
  const access = TIER_ACCESS[userTier];

  // Check which complexity tier this client belongs to
  if (CLIENT_COMPLEXITY.simple.includes(clientName as any)) {
    return access.simple;
  }
  if (CLIENT_COMPLEXITY.medium.includes(clientName as any)) {
    return access.medium;
  }
  if (CLIENT_COMPLEXITY.complex.includes(clientName as any)) {
    return access.complex;
  }
  if (CLIENT_COMPLEXITY.custom.includes(clientName as any)) {
    return access.custom;
  }

  // Default: deny access if client is unknown
  return false;
}

/**
 * Get all accessible clients for a user tier
 * @param userTier - The user's subscription tier
 * @returns Array of client names the user can access
 */
export function getAccessibleClients(userTier: UserTier): ClientName[] {
  const accessible: ClientName[] = [];
  const access = TIER_ACCESS[userTier];

  if (access.simple) {
    accessible.push(...CLIENT_COMPLEXITY.simple);
  }
  if (access.medium) {
    accessible.push(...CLIENT_COMPLEXITY.medium);
  }
  if (access.complex) {
    accessible.push(...CLIENT_COMPLEXITY.complex);
  }
  if (access.custom) {
    accessible.push(...CLIENT_COMPLEXITY.custom);
  }

  return accessible;
}

/**
 * Get the minimum tier required to access a client
 * @param clientName - The client name to check
 * @returns The minimum tier required
 */
export function getMinimumTierForClient(clientName: ClientName): UserTier {
  if (CLIENT_COMPLEXITY.simple.includes(clientName as any)) {
    return "FREE";
  }
  if (CLIENT_COMPLEXITY.medium.includes(clientName as any)) {
    return "LIFETIME_BASIC";
  }
  if (CLIENT_COMPLEXITY.complex.includes(clientName as any)) {
    return "LIFETIME_PRO";
  }
  if (CLIENT_COMPLEXITY.custom.includes(clientName as any)) {
    return "LIFETIME_BASIC";
  }

  // Default: require highest tier for unknown clients
  return "LIFETIME_PRO";
}

/**
 * Get client complexity description
 * @param clientName - The client name to check
 * @returns A description of the client's complexity
 */
export function getClientComplexityInfo(clientName: ClientName): {
  complexity: "simple" | "medium" | "complex" | "custom";
  description: string;
  minimumTier: UserTier;
} {
  if (CLIENT_COMPLEXITY.simple.includes(clientName as any)) {
    return {
      complexity: "simple",
      description: "Global JSON configuration",
      minimumTier: "FREE",
    };
  }
  if (CLIENT_COMPLEXITY.medium.includes(clientName as any)) {
    return {
      complexity: "medium",
      description: "Project-level JSON configuration",
      minimumTier: "LIFETIME_BASIC",
    };
  }
  if (CLIENT_COMPLEXITY.complex.includes(clientName as any)) {
    return {
      complexity: "complex",
      description: clientName === "codex"
        ? "TOML format configuration"
        : "Multiple configuration methods",
      minimumTier: "LIFETIME_PRO",
    };
  }
  if (CLIENT_COMPLEXITY.custom.includes(clientName as any)) {
    return {
      complexity: "custom",
      description: "Custom client path",
      minimumTier: "LIFETIME_BASIC",
    };
  }

  return {
    complexity: "complex",
    description: "Unknown client type",
    minimumTier: "LIFETIME_PRO",
  };
}

/**
 * Check if a user can use local sync feature
 * @param userTier - The user's subscription tier
 * @returns boolean - Whether the user can use local sync
 */
export function canUseLocalSync(userTier: UserTier): boolean {
  // Only FREE tier cannot use local sync
  return userTier !== "FREE";
}

/**
 * Check if a user can use cloud sync feature
 * @param userTier - The user's subscription tier
 * @returns boolean - Whether the user can use cloud sync
 */
export function canUseCloudSync(userTier: UserTier): boolean {
  // Only PRO and TEAM tiers can use cloud sync
  return userTier === "PRO" || userTier === "TEAM";
}
