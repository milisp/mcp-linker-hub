"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Database, FileText, Globe, Code, Server, Package } from "lucide-react"

const categories = [
  { id: "all", name: "All", icon: <Package className="h-4 w-4" /> },
  { id: "database", name: "Database", icon: <Database className="h-4 w-4" /> },
  { id: "filesystem", name: "File System", icon: <FileText className="h-4 w-4" /> },
  { id: "api", name: "API", icon: <Globe className="h-4 w-4" /> },
  { id: "code", name: "Code", icon: <Code className="h-4 w-4" /> },
  { id: "server", name: "Server", icon: <Server className="h-4 w-4" /> },
]

export function CategoryNav() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="container py-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
