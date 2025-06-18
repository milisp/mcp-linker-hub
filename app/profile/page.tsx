"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthedApi } from "@/hooks/useAuthedApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const api = useAuthedApi();
  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState(""); // Track the initial username from server
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);

  const fetchUsername = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ username: string }>("/users/me");
      const fetchedUsername = response.username || "";
      setUsername(fetchedUsername);
      setInitialUsername(fetchedUsername); // Store the initial value
    } catch (err: any) {
      setError(err.message || "Failed to fetch username");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { user_name: username },
      });
      await api.patch("/users/me",{ username });
      
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

  if (isLoading) {
    return <div>Loading username...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {!initialUsername ? ( // Use initialUsername instead of username for conditional rendering
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
                placeholder={isLoading ? "Loading..." : "Enter your username"}
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
      ) : (
        <h1>Welcome, {initialUsername}!</h1> // Use initialUsername for display too
      )}
    </div>
  );
}
