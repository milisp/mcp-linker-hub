"use server";

import { ServerDetails } from "@/components/features/server-details";
import { fetchServer } from "@/lib/api/server";

interface PageProps {
  params: Promise<{ qualified_name: string[] }>;
}

export default async function ServerPage({ params }: PageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const qualifiedName = resolvedParams.qualified_name.join("/");
  let server;
  try {
    server = await fetchServer(qualifiedName);
  } catch (err) {
    console.error(err);
    return <div>Failed to load server: {(err as Error).message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="container mx-auto px-4">
        <div className="relative z-10">
          <ServerDetails server={server} />
        </div>
      </div>
    </div>
  );
}
