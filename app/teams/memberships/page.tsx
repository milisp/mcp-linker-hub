"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthedApi } from "@/hooks/useAuthedApi";
import { TeamMemberRole, TeamMembershipResponse } from "@/types";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function MyMemberships() {
  const api = useAuthedApi();
  const { session } = useSupabase();
  const [memberships, setMemberships] = useState<
    TeamMembershipResponse["memberships"]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMyMemberships = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<TeamMembershipResponse>(
        "/teams/my_memberships",
      );
      setMemberships(data.memberships);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team memberships. Please try again.",
        variant: "destructive",
      });
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: TeamMemberRole) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "member":
        return "outline";
      default:
        return "outline";
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchMyMemberships();
    }
  }, [session?.access_token]);

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">My Team Memberships</h2>
          <Button onClick={fetchMyMemberships} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" />
          </div>
        ) : memberships.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            You are not part of any teams yet.
          </div>
        ) : (
          memberships.map((m) => (
            <Card key={m.team.id} className="mb-4">
              <CardHeader>
                <CardTitle>{m.team.name}</CardTitle>
                <CardDescription>
                  {m.team.description ?? "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant={getRoleBadgeVariant(m.role)}>{m.role}</Badge>
                <Button variant="link" size="sm" asChild>
                  <a href={`/teams/${m.team.id}`}>View Team</a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
