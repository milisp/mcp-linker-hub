import { fetchServers } from "@/lib/server/catalog";
import type { ServerListResponse } from "../../types";
import { ServersClient } from "./servers-client";

export const dynamic = "force-dynamic";

async function getInitialServers(): Promise<ServerListResponse> {
  try {
    const response = await fetchServers({
      pageSize: 20,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch initial servers:", error);
    // Return empty state on server error
    return {
      page: 1,
      pageSize: 20,
      hasNext: false,
      hasPrev: false,
      total: 0,
      servers: [],
    };
  }
}

export default async function Servers() {
  const initialData = await getInitialServers();

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <ServersClient initialData={initialData} />
    </div>
  );
}
