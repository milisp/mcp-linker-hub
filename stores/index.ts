import type { ServerResponse } from "@/types";
import { create } from "zustand";

interface FavoriteStore {
  favorites: ServerResponse[];
  setFavorites: (servers: ServerResponse[]) => void;
  addFavorite: (server: ServerResponse) => void;
  removeFavorite: (id: string) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  favorites: [],
  setFavorites: (servers) => set({ favorites: servers }),
  addFavorite: (server) =>
    set((state) => ({
      favorites: [...state.favorites, server],
    })),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((s) => s.id !== id),
    })),
}));
