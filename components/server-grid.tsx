"use client";

import type { ServerGridType } from "@/app/types";
import { ServerCard } from "@/components/server-card";

export function ServerGrid({ servers }: ServerGridType) {
  // Server grid component
  // Renders a list of ServerCard components
  if (!servers.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No servers found matching your criteria.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
}
