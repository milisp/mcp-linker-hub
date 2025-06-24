import { ServerDetail, ServerListResponse, ServerResponse } from "@/types";
import { api } from ".";

export function fetchServer(qualified_name: string): Promise<ServerDetail> {
  const url = `/servers/@${qualified_name}`;
  return api.get<ServerDetail>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
}

export async function fetchRecommendedServer(): Promise<ServerResponse[]> {
  const url = `/servers/recommended`;
  const response = await api.get<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  return response.servers;
}

export async function fetchOfficialServer(): Promise<ServerResponse[]> {
  const url = `/servers/recommendations/official`;
  const response = await api.get<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  console.log(response);
  return response.servers;
}

// Example of other potential server operations with appropriate HTTP methods
export async function createServer(serverData: any): Promise<ServerResponse> {
  const url = `/servers`;
  return api.post<ServerResponse>(url, serverData);
}

export async function updateServer(
  serverId: string,
  serverData: any,
): Promise<ServerResponse> {
  const url = `/servers/${serverId}`;
  return api.put<ServerResponse>(url, serverData);
}

export async function deleteServer(serverId: string): Promise<void> {
  const url = `/servers/${serverId}`;
  return api.delete<void>(url);
}
