export interface ServerInfo {
  id: string;
  name: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  githubStars: number;
  downloads: number;
  tools: string[];
  source: string;
}

export interface ServerGridType {
  servers: ServerInfo[];
}

// API response types to match backend schema
export interface ServerResponse {
  id: string;
  name?: string;
  description?: string;
  source: string;
  developer: string;
  isOfficial: boolean;
  rating: number;
  githubStars: number;
  downloads: number;
  views: number;
  isFavorited?: boolean;
  categoryId?: number;
  tags?: string[];
  tools?: string[];
}

export interface ServerListResponse {
  version?: string;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev?: boolean;
  total?: number;
  servers: ServerResponse[];
  cacheHit?: boolean;
}
