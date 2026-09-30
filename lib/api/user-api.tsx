// lib/api/user-api.ts
import { API_V1_URL, handleApiRequest } from "@/lib/api";

interface isFavorite {
  isFavorited: boolean;
  message: string;
}

export const userApi = {
  addFavorite: (serverId: string) =>
    handleApiRequest<isFavorite>(
      `${API_V1_URL}/servers/favorites/${serverId}`,
      {
        method: "POST",
      },
    ),

  removeFavorite: (serverId: string) =>
    handleApiRequest<isFavorite>(
      `${API_V1_URL}/servers/favorites/${serverId}`,
      {
        method: "DELETE",
      },
    ),

  checkFavorite: (serverId: string) =>
    handleApiRequest<{ isFavorited: boolean }>(
      `${API_V1_URL}/servers/favorites/check/${serverId}`,
      {
        method: "GET",
      },
    ),
};
