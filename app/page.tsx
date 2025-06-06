import { ImageCarousel, QuickStartGuide } from "@/components/common";
import { NewsList } from "@/components/common/NewsList";
import { SubmitSection } from "@/components/features/submit-server";
import { FeaturedServers } from "@/components/sections";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CheckCircle, Download, Github, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="gradient-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-black/20 pointer-events-none" />

      <div className="relative z-10">
        <ImageCarousel />

        {/* Hero Section - Project Introduction */}
        <section className="px-6 py-0 max-w-5xl mx-auto text-center">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              MCP Linker
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              Add MCP servers to Claude Desktop, Cursor, Windsurf, VS Code,
              Cline, neovim, and more — in{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                two clicks
              </span>
              . Cross-platform. Tauri GUI. Server management included. Say goodbye to <strong>copy-paste</strong>, <strong>git clone</strong>
            </p>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="https://github.com/milisp/mcp-linker/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download MCP Linker
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </a>

              <a
                href="https://github.com/milisp/mcp-linker"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
              >
                <span className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  View on GitHub
                </span>
              </a>
            </div>

            {/* Value Proposition Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  2 Clicks
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Easy Installation
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  6+ IDEs
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Supported Editors
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Open Source
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
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

        {/* Why MCP Linker Section */}
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose MCP Linker?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stop wasting time with complex configurations. Get your MCP
              servers running in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Install and configure MCP servers in just two clicks. No
                terminal commands, no configuration files.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Universal Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works with Claude Desktop, Cursor, Windsurf, VS Code, Cline,
                neovim, and more editors.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Smart Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built-in server management, updates, and configuration.
                Everything you need in one place.
              </p>
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
      </div>
    </main>
  );
}
