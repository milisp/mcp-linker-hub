"use client";

import { ServerResponse } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api/user-api";
import { Check, Copy, Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSupabase } from "../providers/supabase-provider";

interface isFavType {
  isFavorited: string;
}
export function ServerHeader({ server }: { server: ServerResponse }) {
  const { toast } = useToast();
  const { getAccessToken, supabase } = useSupabase();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handle403Error(
    error: any,
    retryCallback: () => Promise<void>,
  ) {
    if (error.status === 403) {
      const {
        data: { session: newSession },
        error: refreshError,
      } = await supabase.auth.refreshSession();
      if (newSession) {
        await retryCallback();
      } else {
        console.error("Session refresh failed:", refreshError);
        toast({
          title: "Session expired",
          description: "Please login again",
          variant: "destructive",
        });
      }
    }
  }

  useEffect(() => {
    async function getFav() {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.log("No access token available");
          return;
        }

        const response = await userApi.checkFavorite(server.id, accessToken);
        console.log("is fav", response);
        setIsFavorite(Boolean(response.isFavorited));
      } catch (error: any) {
        console.error("Favorite check failed:", error);
        await handle403Error(error, getFav);
      }
    }
    getFav();
  }, [getAccessToken, server.id, supabase.auth, toast]);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast({
          title: "Authentication required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
        return;
      }

      if (isFavorite) {
        const resp = await userApi.removeFavorite(server.id, accessToken);
        console.log("rm fav", resp);
        setIsFavorite(resp.isFavorited);
        toast({
          title: "Removed from favorites",
          description: `${server.name} has been removed from your favorites`,
        });
      } else {
        const resp = await userApi.addFavorite(server.id, accessToken);
        console.log("add fav", resp);
        setIsFavorite(resp.isFavorited);
        toast({
          title: "Added to favorites",
          description: `${server.name} has been added to your favorites`,
        });
      }
    } catch (error: any) {
      console.error("Toggle favorite failed:", error);
      await handle403Error(error, toggleFavorite);
    } finally {
      setIsLoading(false);
    }
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
