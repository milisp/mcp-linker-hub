"use client";

import { ServerGridSkeleton } from "@/components/common";
import { ServerGrid } from "@/components/features";
import { useSupabase } from "@/components/providers/supabase-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import type { ServerResponse } from "../types";

export default function FavoriteServers() {
  const { session } = useSupabase();

  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<ServerResponse[]>(
        "/servers/favorites/",
        undefined,
        {},
        session?.access_token,
      )
      .then((data) => setServers(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="servers"
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          Favorites Servers
        </h2>
        {isLoading ? <ServerGridSkeleton /> : <ServerGrid servers={servers} />}
      </div>
    </main>
  );
}
