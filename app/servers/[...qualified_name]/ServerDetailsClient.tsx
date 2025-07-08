"use client";

import { ServerDetails } from "@/components/features/server-details";
import { fetchServer } from "@/lib/api/server";
import useSWR from "swr";

interface ServerDetailsClientProps {
  qualifiedName: string;
}

export default function ServerDetailsClient({
  qualifiedName,
}: ServerDetailsClientProps) {
  // Use SWR to fetch server details
  const { data, error, isLoading } = useSWR(
    qualifiedName ? ["server", qualifiedName] : null,
    ([, qn]) => fetchServer(qn),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load server: {error.message}</div>;
  if (!data) return <div>No server data found.</div>;

  // Render server details
  return <ServerDetails server={data} />;
}
