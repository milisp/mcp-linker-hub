"use client";

import { ErrorFallback, ServerGridSkeleton } from "@/components/common";
import { CategoryNav, ServerGrid } from "@/components/features";
import { HeroSection } from "@/components/sections";
import { useServers, useServersFilters } from "@/hooks";
import type { ServerGridType, ServerListResponse } from "../types";

interface ServersClientProps {
  initialData: ServerListResponse;
}

export const MainContent = ({
  servers,
  isLoading,
}: ServerGridType & { isLoading: boolean }) => {
  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="servers"
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          Featured Servers
        </h2>
        {isLoading ? <ServerGridSkeleton /> : <ServerGrid servers={servers} />}
      </div>
    </main>
  );
};

export function ServersClient({ initialData }: ServersClientProps) {
  const { searchTerm, setSearchTerm, currentCategory, setCurrentCategory } =
    useServersFilters();

  const {
    servers,
    data,
    error,
    isLoading,
    isLoadingMore,
    handleRetry,
    loadMore,
  } = useServers({
    initialData,
    searchTerm,
    currentCategory,
  });

  // Show error fallback for persistent errors
  if (error && !isLoading) {
    return (
      <>
        <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CategoryNav
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />
        <ErrorFallback onRetry={handleRetry} />
      </>
    );
  }

  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Categories Filter */}
      <CategoryNav
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />

      {/* Main Content Area (Server Grid) */}
      <MainContent servers={servers} isLoading={isLoading} />

      {/* Show load more button */}
      {data?.hasNext && !isLoading && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
