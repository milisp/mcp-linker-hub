"use client";

import { CategoryNav } from "@/components/category-nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { ServerGrid } from "@/components/server-grid";
import { initialServers } from "@/lib/data";
import { useEffect, useState } from "react";
import type { ServerGridType } from "../types";

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
  // Manages state for search, filtering, and server data
  const [servers, setServers] = useState(initialServers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [filteredServers, setFilteredServers] = useState(initialServers);

  useEffect(() => {
    // Effect to filter servers based on search term and category
    let result = servers;

    // Filter by category
    if (currentCategory !== "all") {
      result = result.filter((server) => server.category === currentCategory);
    }

    // Filter by search term
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
  }, [searchTerm, currentCategory, servers]);

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

      <Footer />
    </div>
  );
}
