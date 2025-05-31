"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, PenToolIcon as Tool, Heart } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/components/ui/use-toast"

interface ServerCardProps {
  server: {
    id: string
    name: string
    author: string
    description: string
    tags: string[]
    githubStars: number
    downloads: number
    toolCount: number
    imageUrl: string
  }
}

export function ServerCard({ server }: ServerCardProps) {
  const { session } = useSupabase()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      })
      return
    }

    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${server.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    })
  }

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-background/60 border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
              <Image src={server.imageUrl || "/placeholder.svg"} alt={server.name} fill className="object-cover" />
            </div>
            <div>
              <Link href={`/server/${server.id}`} className="font-medium text-lg hover:underline">
                {server.name}
              </Link>
              <p className="text-sm text-muted-foreground">by {server.author}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isFavorite ? "text-red-500" : "text-muted-foreground"}`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            <span className="sr-only">Favorite</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{server.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {server.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/30 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{server.githubStars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{server.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tool className="h-4 w-4" />
            <span>{server.toolCount} tools</span>
          </div>
        </div>
        <Link href={`/server/${server.id}`}>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
