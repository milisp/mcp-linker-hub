"use client"

import { useState } from "react"
import { ServerCard } from "@/components/server-card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Mock data for server cards
const mockServers = [
  {
    id: "1",
    name: "Neon MCP Server",
    author: "Neon",
    description: "Interact with Neon Postgres databases using natural language",
    tags: ["database", "postgres", "sql"],
    githubStars: 1200,
    downloads: 45000,
    toolCount: 12,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "File System MCP",
    author: "Vercel",
    description: "Access and manipulate file systems through natural language",
    tags: ["filesystem", "storage"],
    githubStars: 980,
    downloads: 32000,
    toolCount: 8,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "API Gateway MCP",
    author: "OpenAI",
    description: "Connect to various APIs using natural language commands",
    tags: ["api", "integration"],
    githubStars: 2100,
    downloads: 78000,
    toolCount: 15,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Code Assistant MCP",
    author: "GitHub",
    description: "Generate, analyze, and refactor code through conversation",
    tags: ["code", "development"],
    githubStars: 3200,
    downloads: 92000,
    toolCount: 20,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    name: "Server Management MCP",
    author: "AWS",
    description: "Manage cloud servers and infrastructure with natural language",
    tags: ["server", "cloud", "infrastructure"],
    githubStars: 1500,
    downloads: 56000,
    toolCount: 18,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    name: "Database Schema MCP",
    author: "MongoDB",
    description: "Design and modify database schemas through conversation",
    tags: ["database", "schema", "design"],
    githubStars: 890,
    downloads: 28000,
    toolCount: 10,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

export function ServerGrid() {
  const [visibleCount, setVisibleCount] = useState(6)

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, mockServers.length))
  }

  return (
    <section className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Popular MCP Servers</h2>
        <Button variant="outline" size="sm">
          Sort by: Popular
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServers.slice(0, visibleCount).map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
      {visibleCount < mockServers.length && (
        <div className="flex justify-center mt-10">
          <Button onClick={loadMore} variant="outline" className="gap-2">
            Load More <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}
