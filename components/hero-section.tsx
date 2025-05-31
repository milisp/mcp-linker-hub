"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log("Searching for:", searchQuery)
  }

  return (
    <section className="py-20 md:py-28 container text-center relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
        Discover MCP Servers
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Find and connect to Model Context Protocol servers to enhance your AI applications with external tools and data
        sources [^2].
      </p>
      <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8 relative">
        <Input
          type="text"
          placeholder="Search for MCP servers..."
          className="pr-10 h-12 rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="icon" className="absolute right-1 top-1 rounded-full h-10 w-10">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
        <span>Popular:</span>
        <Button variant="link" className="p-0 h-auto" onClick={() => setSearchQuery("database")}>
          database
        </Button>
        <Button variant="link" className="p-0 h-auto" onClick={() => setSearchQuery("file system")}>
          file system
        </Button>
        <Button variant="link" className="p-0 h-auto" onClick={() => setSearchQuery("api")}>
          api
        </Button>
        <Button variant="link" className="p-0 h-auto" onClick={() => setSearchQuery("neon")}>
          neon
        </Button>
      </div>
    </section>
  )
}
