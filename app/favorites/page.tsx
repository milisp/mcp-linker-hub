"use client";

import { ServerGridSkeleton } from "@/components/common";
import { ServerGrid } from "@/components/features";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoriteServers() {
  const { favorites, isLoading } = useFavorites();

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="servers"
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          Favorites Servers
        </h2>
        {isLoading ? (
          <ServerGridSkeleton />
        ) : (
          <ServerGrid servers={favorites} />
        )}
      </div>
    </main>
  );
}
