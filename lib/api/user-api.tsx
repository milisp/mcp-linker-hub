// lib/api/user-api.ts
import { API_V1_URL, handleApiRequest } from "@/lib/api";

interface isFavorite {
  isFavorited: boolean;
  message: string;
}

export const userApi = {
  addFavorite: (serverId: string, accessToken: string) =>
    handleApiRequest<isFavorite>(
      `${API_V1_URL}/servers/favorites/${serverId}`,
      {
        method: "POST",
      },
      accessToken,
    ),

  removeFavorite: (serverId: string, accessToken: string) =>
    handleApiRequest<isFavorite>(
      `${API_V1_URL}/servers/favorites/${serverId}`,
      {
        method: "DELETE",
      },
      accessToken,
    ),

  checkFavorite: (serverId: string, accessToken: string) =>
    handleApiRequest<{ isFavorited: string }>(
      `${API_V1_URL}/servers/favorites/check/${serverId}`,
      {
        method: "GET",
      },
      accessToken,
    ),
};
