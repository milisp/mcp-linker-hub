"use client";

import { CategoryNav } from "@/components/category-nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { ServerGrid } from "@/components/server-grid";
import { ApiError, fetchServers } from "@/lib/api/servers";
import { useCallback, useEffect, useState } from "react";
import type { ServerGridType, ServerInfo } from "../types";

const MainContent = ({ servers }: ServerGridType) => {
  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="servers"
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          Featured Servers
        </h2>
        <ServerGrid servers={servers} />
      </div>
    </main>
  );
};

export default function Servers() {
  // State management for server data, search, and filtering
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [filteredServers, setFilteredServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasNext: false,
    hasPrev: false,
    total: 0
  });

  // Load servers from API
  const loadServers = useCallback(async (searchQuery?: string, category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Map category names to IDs for API call
      const categoryMap: Record<string, number> = {
        'filesystem': 1,
        'database': 2,
        'web': 3,
        'ai': 4,
        'development': 5,
        'utility': 6,
        'communication': 7,
        'productivity': 8,
        'analytics': 9,
        'security': 10
      };

      const response = await fetchServers({
        pageSize: 20, // Load more servers initially
        needTotal: true,
        includeRelations: true,
        search: searchQuery?.trim() || undefined,
        categoryId: category && category !== 'all' ? categoryMap[category] : undefined
      });
      
      setServers(response.servers);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load servers:', err);
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`);
      } else {
        setError('Failed to load servers. Please check your internet connection and try again.');
      }
      // Fallback to empty array instead of crashing
      setServers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadServers();
  }, [loadServers]);

  // Handle search and category changes with API calls for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || currentCategory !== 'all') {
        loadServers(searchTerm, currentCategory);
      } else {
        loadServers();
      }
    }, 500); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentCategory, loadServers]);

  // Client-side filtering for immediate response (fallback)
  useEffect(() => {
    let result = servers;

    // If we're not using API filtering, apply client-side filtering
    if (!searchTerm && currentCategory === 'all') {
      setFilteredServers(result);
      return;
    }

    // Apply additional client-side filtering if needed
    if (currentCategory !== "all") {
      result = result.filter((server) => server.category === currentCategory);
    }

    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (server) =>
          server.name.toLowerCase().includes(lowerSearchTerm) ||
          server.description.toLowerCase().includes(lowerSearchTerm) ||
          server.tags.some((tag) =>
            tag.toLowerCase().includes(lowerSearchTerm),
          ) ||
          server.tools.some((tool) =>
            tool.toLowerCase().includes(lowerSearchTerm),
          ) ||
          server.author.toLowerCase().includes(lowerSearchTerm),
      );
    }
    setFilteredServers(result);
  }, [servers, searchTerm, currentCategory]);

  const handleRetry = () => {
    loadServers(searchTerm || undefined, currentCategory !== 'all' ? currentCategory : undefined);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen gradient-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading servers...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen gradient-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Unable to Load Servers
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen gradient-background">
      <Navbar />

      {/* Hero Section with Search */}
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Categories Filter */}
      <CategoryNav
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />

      {/* Main Content Area (Server Grid) */}
      <MainContent servers={filteredServers} />

      {/* Show server count and pagination info */}
      {pagination.total > 0 && (
        <div className="text-center py-4 text-gray-600">
          Showing {filteredServers.length} of {pagination.total} servers
        </div>
      )}

      <Footer />
    </div>
  );
}
