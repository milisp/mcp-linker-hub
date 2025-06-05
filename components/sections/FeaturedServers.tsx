"use client";

import { ServerResponse } from "@/app/types";
import { fetchRecommendedServer } from "@/lib/api/server";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ServerGrid } from "../features";

export default function FeaturedServers() {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedServer()
      .then(setServers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🔥 Featured Servers
        </h2>
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🔥 Featured Servers
      </h2>
      <ServerGrid servers={servers} />

      <div className="text-center mt-8">
        <Link href="/servers">
          <button className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            more →
          </button>
        </Link>
      </div>
    </section>
  );
}
