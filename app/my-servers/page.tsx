"use client";

import { ServerGridSkeleton } from "@/components/common";
import { ServerGrid } from "@/components/features";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import type { ServerListResponse, ServerResponse } from "../../types";

export default function MyServers() {
  const { session } = useAuth();

  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyServers = async () => {
      try {
        const data = await api.get<ServerListResponse>(
          "/servers/my",
          undefined,
          {},
        );
        setServers(data.servers);
      } catch (error) {
        console.error("Failed to fetch my servers:", error);
        setServers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyServers();
  }, [session?.user.id]);

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="servers"
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          My Servers
        </h2>
        {isLoading ? (
          <ServerGridSkeleton />
        ) : (
          <ServerGrid servers={servers || []} />
        )}
      </div>
    </main>
  );
}
