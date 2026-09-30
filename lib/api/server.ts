import type { ServerDetail, ServerListResponse, ServerResponse } from "@/types";
import { api } from ".";
export async function fetchServer(
  qualifiedName: string,
): Promise<ServerDetail> {
  return api.get(`/servers/@${qualifiedName}`);
}
export async function fetchRecommendedServer(): Promise<ServerResponse[]> {
  return (await api.get<ServerListResponse>("/servers/recommended")).servers;
}
export async function fetchOfficialServer(): Promise<ServerResponse[]> {
  return (
    await api.get<ServerListResponse>("/servers/recommendations/official")
  ).servers;
}
export async function createServer(data: unknown): Promise<ServerResponse> {
  return api.post("/servers", data);
}
export async function updateServer(
  id: string,
  data: unknown,
): Promise<ServerResponse> {
  return api.put(`/servers/${id}`, data);
}
export async function deleteServer(id: string): Promise<void> {
  return api.delete(`/servers/${id}`);
}
