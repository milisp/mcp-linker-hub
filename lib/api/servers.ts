import type { ServerListResponse } from "@/app/types";
import { API_V1_URL, handleApiRequest } from ".";

interface FetchServersParams {
  page?: number;
  pageSize?: number;
  cat?: string;
  search?: string;
  developer?: string;
  sort?: string;
  direction?: "asc" | "desc";
  includeRelations?: boolean;
  needTotal?: boolean;
}

function buildServerQueryParams(params: Record<string, any>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}

export async function fetchServers(
  params: FetchServersParams = {},
): Promise<ServerListResponse> {
  const {
    page = 1,
    pageSize = 20,
    sort = "github_stars",
    direction = "desc",
    includeRelations = true,
    needTotal = false,
    ...rest
  } = params;

  const queryString = buildServerQueryParams({
    page,
    page_size: pageSize,
    sort,
    direction,
    include_relations: includeRelations,
    need_total: needTotal,
    ...rest,
  });

  const url = `${API_V1_URL}/servers/?${queryString}`;
  return await handleApiRequest<ServerListResponse>(url, {
    next: { revalidate: 300 },
  });
}

export async function fetchMinimalServers(
  params: {
    page?: number;
    pageSize?: number;
    cat?: string;
    sort?: string;
    direction?: "asc" | "desc";
  } = {},
) {
  const {
    page = 1,
    pageSize = 30,
    sort = "github_stars",
    direction = "desc",
    ...rest
  } = params;

  const queryString = buildServerQueryParams({
    page,
    page_size: pageSize,
    sort,
    direction,
    ...rest,
  });

  const url = `${API_V1_URL}/servers/minimal?${queryString}`;
  return await handleApiRequest(url, {
    next: { revalidate: 600 },
  });
}
