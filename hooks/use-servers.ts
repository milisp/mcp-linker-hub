import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";
import { fetchServers } from "@/lib/api/servers";
import type { ServerListResponse } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const isApiError = (err: any): err is ApiError => err?.status !== undefined;

interface UseServersOptions {
  initialData?: ServerListResponse;
  searchTerm: string;
  currentCategory: string;
}

export function useServers({
  initialData,
  searchTerm,
  currentCategory,
}: UseServersOptions) {
  const [hasShownError, setHasShownError] = useState(false);
  const [page, setPage] = useState(1);
  const [allServers, setAllServers] = useState(initialData?.servers || []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  // Reset page and all server data when search parameters change
  useEffect(() => {
    setPage(1);
    setAllServers([]);
    setIsLoadingMore(false); // Reset loading state
    setHasShownError(false); // Reset error state
  }, [searchTerm, currentCategory]);

  // Generate SWR key based on search parameters
  const swrKey = useMemo(() => {
    // 如果搜索词长度小于等于2，不触发搜索
    if (searchTerm?.trim().length > 0 && searchTerm?.trim().length <= 2) {
      return null;
    }

    const params = {
      page,
      pageSize: 10,
      needTotal: true,
      includeRelations: true,
      search: searchTerm?.trim() || undefined,
      cat:
        currentCategory && currentCategory !== "all"
          ? currentCategory
          : undefined,
    };
    return ["servers", params];
  }, [searchTerm, currentCategory, page]);

  // SWR fetcher function
  const fetcher = async ([_, params]: [string, any]) => {
    return await fetchServers(params);
  };

  // Use SWR for data fetching
  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    fallbackData: page === 1 ? initialData : undefined,
    revalidateOnFocus: false,
  });

  // Handle data accumulation for pagination with duplicate prevention
  useEffect(() => {
    if (data?.servers) {
      if (page === 1) {
        // First page or new search - replace all data with a Set to ensure uniqueness
        const uniqueServers = Array.from(
          new Map(data.servers.map((server) => [server.id, server])).values(),
        );
        setAllServers(uniqueServers);
      } else {
        // Subsequent pages - append unique data
        setAllServers((prev) => {
          // Use Map to ensure O(1) lookup and automatic deduplication
          const serverMap = new Map(prev.map((server) => [server.id, server]));
          data.servers.forEach((server) => serverMap.set(server.id, server));
          return Array.from(serverMap.values());
        });
      }
      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Error handling with toast notifications
  useEffect(() => {
    if (error && !hasShownError) {
      toast({
        title: "Error",
        description: isApiError(error)
          ? error.message
          : "Failed to load servers. Please try again.",
        variant: "destructive",
      });
      setHasShownError(true);
      setIsLoadingMore(false);
    }
  }, [error, hasShownError, toast]);

  const handleRetry = useCallback(() => {
    setHasShownError(false);
    mutate();
  }, [mutate]);

  const loadMore = useCallback(() => {
    if (data?.hasNext && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [data?.hasNext, isLoading, isLoadingMore]);

  return {
    servers: allServers,
    data,
    error,
    isLoading: isLoading && page === 1, // Only show loading for first page
    isLoadingMore,
    handleRetry,
    loadMore,
  };
}
