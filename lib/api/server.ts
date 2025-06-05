import { ServerListResponse, ServerResponse } from "@/app/types";
import { API_V1_URL, handleApiRequest } from ".";

export function fetchServer(qualified_name: string): Promise<ServerResponse> {
  const url = `${API_V1_URL}/servers/@${qualified_name}`;
  return handleApiRequest<ServerResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
}


export async function fetchRecommendedServer(): Promise<ServerResponse[]> {
  const url = `${API_V1_URL}/servers/recommended`;
  const response = await handleApiRequest<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  return response.servers;
}

export async function fetchOfficialServer(): Promise<ServerResponse[]> {
  const url = `${API_V1_URL}/servers/recommendations/official`;
  const response = await handleApiRequest<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  console.log(response)
  return response.servers;
}
