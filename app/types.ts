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
