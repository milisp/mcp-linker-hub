"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.user_metadata.user_name) {
        // If user already has a username, redirect them away from profile page
        router.push("/");
      }
    };
    fetchUser();
  }, [supabase, router]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { user_name: username },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your username has been successfully updated.",
      });

      router.push("/");
      router.refresh(); // Refresh to reflect changes in layout
    } catch (error: any) {
      toast({
        title: "Update failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="backdrop-blur-sm bg-background/60 border-muted rounded-md border p-6">
          <div className="space-y-1 mb-4">
            <h2 className="text-2xl font-bold">Complete your Profile</h2>
            <p>Please enter a username to continue</p>
          </div>
          <form onSubmit={handleUsernameUpdate}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Username"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
