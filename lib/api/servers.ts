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

export async function fetchServers(
  params: FetchServersParams = {},
): Promise<ServerListResponse> {
  const {
    page = 1,
    pageSize = 20,
    cat,
    search,
    developer,
    sort = "github_stars",
    direction = "desc",
    includeRelations = true,
    needTotal = false,
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort,
    direction,
    include_relations: includeRelations.toString(),
    need_total: needTotal.toString(),
  });

  if (cat) searchParams.set("cat", cat);
  if (search && search.trim()) searchParams.set("search", search.trim());
  if (developer && developer.trim())
    searchParams.set("developer", developer.trim());

  const url = `${API_V1_URL}/servers/?${searchParams}`;
  const data = await handleApiRequest<ServerListResponse>(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  return data;
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
    cat,
    sort = "github_stars",
    direction = "desc",
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", page.toString());
  searchParams.set("page_size", pageSize.toString());
  searchParams.set("sort", sort);
  searchParams.set("direction", direction);
  if (cat) searchParams.set("cat", cat);

  const url = `${API_V1_URL}/servers/minimal?${searchParams}`;
  return handleApiRequest(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
}
