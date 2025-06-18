// Tool interface for server tools
export interface Tool {
  name: string;
  description: string;
}

// API response types to match backend schema
export interface ServerResponse {
  id: string;
  name: string;
  qualifiedName: string;
  description?: string;
  logoUrl?: string;
  source: string;
  developer: string;
  isOfficial: boolean;
  rating: number;
  githubStars: number;
  downloads: number;
  views: number;
  isFavorited: boolean;
  cat?: string;
  tags?: string[];
  tools?: Tool[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  documentation?: string;
  toolCount?: number;
}

export interface ServerGridType {
  servers: ServerResponse[];
}

export interface ServerListResponse {
  version?: string;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev?: boolean;
  total?: number;
  servers: ServerResponse[];
}

export interface SseConfig {
  url: string;
  type: string;
}

export interface StdioConfig {
  command: string;
  args?: string;
  env: Record<string, string>;
}

export type ServerConfig = SseConfig | StdioConfig

// Config item structure that matches the API response
export interface ConfigItem {
  command: string;
  args: string[];
}

// Server configuration structure that matches the API response
export interface ServerConfigGroup {
  id: string;
  serverId: string;
  configItems: ConfigItem[];
}

export interface ServerDetail extends ServerResponse {
  serverConfigs: ServerConfigGroup[];
}

export type AuthType = "google" | "github" | "discord";
// Team response type from API
export type TeamResponse = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

// Team list response type from API
export type TeamListResponse = {
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
  teams: TeamResponse[];
};

// Form data type for team creation/editing
export type TeamFormData = {
  name: string;
  description: string;
};

// Team member types
export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export type TeamMember = {
  id: string;
  userId: string;
  teamId: string;
  role: TeamMemberRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    fullname?: string;
  };
};

export type TeamMembersResponse = {
  members: TeamMember[];
};

export type TeamMembershipResponse = {
  memberships: Array<{
    id: string;
    role: TeamMemberRole;
    joinedAt: string;
    team: TeamResponse;
  }>;
};

export type AddTeamMemberData = {
  email: string;
  role: TeamMemberRole;
}; 