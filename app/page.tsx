"use client";

import FeaturedServers from "@/components/FeaturedServers";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/footer";
import ImageCarousel from "@/components/ImageCarousel";
import { Navbar } from "@/components/navbar";
import { NewsList } from "@/components/NewsList";
import { QuickStartGuide } from "@/components/QuickStartGuide";
import { SubmitSection } from "@/components/submit-server";

export default function Home() {
  return (
    <main className="gradient-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-black/20 pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar />

        <ImageCarousel />

        {/* Hero Section - Project Introduction */}
        <section className="px-6 py-12 max-w-4xl mx-auto text-center">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              MCP Linker
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Add MCP servers to Claude Desktop, Cursor, Windsurf, VS Code, Cline,
              neovim, and more — in <span className="font-semibold text-blue-600 dark:text-blue-400">two clicks</span>. 
              Cross-platform. Tauri GUI. Server management included.
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                Cross-platform
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                Open Source
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                No Skills Required
              </span>
            </div>
          </div>
        </section>

        <NewsList />
        <FeaturesSection />
        <FeaturedServers />
        <QuickStartGuide />

        {/* Submit Server Section */}
        <div className="px-6 py-8">
          <SubmitSection />
        </div>

        <Footer />
      </div>
    </main>
  );
}
