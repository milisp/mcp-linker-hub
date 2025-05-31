import type { ServerInfo, ServerListResponse, ServerResponse } from "@/app/types";

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchServersParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  search?: string;
  developer?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  includeRelations?: boolean;
  needTotal?: boolean;
}

// Category mapping helper
const CATEGORY_MAP: Record<number, string> = {
  1: 'filesystem',
  2: 'database', 
  3: 'web',
  4: 'ai',
  5: 'development',
  6: 'utility',
  7: 'communication',
  8: 'productivity',
  9: 'analytics',
  10: 'security'
};

function getCategoryName(categoryId?: number): string {
  return categoryId ? CATEGORY_MAP[categoryId] || 'other' : 'other';
}

function transformServerResponse(server: ServerResponse): ServerInfo {
  return {
    id: server.id,
    name: server.name || 'Unnamed Server',
    author: server.developer || 'Unknown Author',
    description: server.description || 'No description available',
    category: getCategoryName(server.categoryId),
    tags: server.tags || [],
    githubStars: server.githubStars || 0,
    downloads: server.downloads || 0,
    tools: server.tools || [],
    source: server.source || ''
  };
}

async function handleApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(`API request failed: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchServers(params: FetchServersParams = {}): Promise<{
  servers: ServerInfo[];
  pagination: {
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    total?: number;
  };
}> {
  const {
    page = 1,
    pageSize = 20,
    categoryId,
    search,
    developer,
    sort = 'github_stars',
    direction = 'desc',
    includeRelations = true,
    needTotal = false
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort,
    direction,
    include_relations: includeRelations.toString(),
    need_total: needTotal.toString()
  });

  if (categoryId) searchParams.set('category_id', categoryId.toString());
  if (search && search.trim()) searchParams.set('search', search.trim());
  if (developer && developer.trim()) searchParams.set('developer', developer.trim());

  const url = `${API_BASE_URL}/servers/?${searchParams}`;
  const data = await handleApiRequest<ServerListResponse>(url, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  
  return {
    servers: data.servers.map(transformServerResponse),
    pagination: {
      page: data.page,
      pageSize: data.pageSize,
      hasNext: data.hasNext,
      hasPrev: data.hasPrev || false,
      total: data.total
    }
  };
}

export async function fetchMinimalServers(params: {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
} = {}) {
  const {
    page = 1,
    pageSize = 30,
    categoryId,
    sort = 'github_stars',
    direction = 'desc'
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort,
    direction
  });

  if (categoryId) searchParams.set('category_id', categoryId.toString());

  const url = `${API_BASE_URL}/servers/minimal?${searchParams}`;
  return handleApiRequest(url, {
    next: { revalidate: 600 } // Cache for 10 minutes
  });
}

// Health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000 as any // TypeScript doesn't know about timeout, but it works
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { ApiError };
