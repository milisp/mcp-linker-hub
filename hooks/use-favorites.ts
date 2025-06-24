import { useSupabase } from "@/components/providers/supabase-provider";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { userApi } from "@/lib/api/user-api";
import { useFavoriteStore } from "@/stores";
import type { ServerResponse } from "@/types";
import useSWR, { mutate } from "swr";

// SWR keys
const FAVORITES_KEY = "favorites";
const favoriteStatusKey = (serverId: string) => `favorite-status-${serverId}`;

// Custom SWR hook for favorites list
export function useFavorites() {
  const { session } = useSupabase();

  const { data, error, isLoading } = useSWR(
    session?.access_token ? [FAVORITES_KEY, session.access_token] : null,
    ([_, token]) =>
      api.get<ServerResponse[]>("/servers/favorites/", undefined, {}, token),
    {
      onSuccess: (data) => {
        // Sync with Zustand store
        const { setFavorites } = useFavoriteStore.getState();
        setFavorites(data);
      },
    },
  );

  return {
    favorites: data || [],
    isLoading,
    error,
  };
}

// Custom SWR hook for checking favorite status
export function useFavoriteStatus(serverId: string) {
  const { getAccessToken } = useSupabase();

  const { data, error, isLoading } = useSWR(
    serverId ? [favoriteStatusKey(serverId), serverId] : null,
    async ([_, id]) => {
      const token = await getAccessToken();
      if (!token) return { isFavorited: false };
      return userApi.checkFavorite(id, token);
    },
  );

  return {
    isFavorite: Boolean(data?.isFavorited),
    isLoading,
    error,
  };
}

// Custom hook for favorite mutations
export function useFavoriteMutations() {
  const { getAccessToken } = useSupabase();
  const { toast } = useToast();
  const { addFavorite, removeFavorite } = useFavoriteStore();

  const toggleFavorite = async (
    server: ServerResponse,
    currentStatus: boolean,
  ) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
        return false;
      }

      // Use the same key format as in useFavoriteStatus (array key)
      const statusKey = [favoriteStatusKey(server.id), server.id];
      const newStatus = !currentStatus;

      // Optimistic update
      mutate(statusKey, { isFavorited: newStatus }, false);

      if (currentStatus) {
        // Remove from favorites
        const result = await userApi.removeFavorite(server.id, token);
        removeFavorite(server.id);

        toast({
          title: "Removed from favorites",
          description: `${server.name} has been removed from your favorites`,
        });

        // Update cache with server response
        mutate(statusKey, { isFavorited: result.isFavorited }, false);
        mutate([FAVORITES_KEY, token]); // Revalidate favorites list

        return result.isFavorited;
      } else {
        // Add to favorites
        const result = await userApi.addFavorite(server.id, token);
        addFavorite(server);

        toast({
          title: "Added to favorites",
          description: `${server.name} has been added to your favorites`,
        });

        // Update cache with server response
        mutate(statusKey, { isFavorited: result.isFavorited }, false);
        mutate([FAVORITES_KEY, token]); // Revalidate favorites list

        return result.isFavorited;
      }
    } catch (error) {
      // Revert optimistic update on error
      mutate([favoriteStatusKey(server.id), server.id]);

      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
      return currentStatus; // Return original status on error
    }
  };

  return { toggleFavorite };
}
