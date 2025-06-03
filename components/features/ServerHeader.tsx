"use client";

import { ServerResponse } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSupabase } from "../providers/supabase-provider";

export function ServerHeader({ server }: { server: ServerResponse }) {
  const { toast } = useToast();
  const { session } = useSupabase();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFavorite = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${server.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    });
  };

  const copyServerUrl = () => {
    navigator.clipboard.writeText(location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
        <Image
          src={server.imageUrl || "/placeholder.svg"}
          alt={server.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">{server.name}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={copyServerUrl}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy link</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isFavorite ? "text-red-500" : ""}`}
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">by {server.developer}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {server.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
