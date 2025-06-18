"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useAuthedApi } from "@/hooks/useAuthedApi";
import { TeamMember, TeamMemberRole, TeamMembersResponse } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AddTeamMemberForm } from "../components/AddTeamMemberForm";

export default function TeamMembers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { session } = useSupabase();
  const api = useAuthedApi();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<TeamMembersResponse>(
        `/teams/${id}/members`,
      );
      setMembers(data as unknown as TeamMember[]);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team members. Please try again.",
        variant: "destructive",
      });
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (newMemberData: {
    email: string;
    role: TeamMemberRole;
  }) => {
    if (!newMemberData.email.trim()) return;

    setIsAddingMember(true);
    try {
      const userData = await api.get<{ id: string }>(
        `/users/by-email?email=${encodeURIComponent(newMemberData.email)}`,
      );

      console.log("User Data ID:", userData.id);

      const payload = {
        team_id: id,
      };

      // Convert role to uppercase for API
      const roleUppercase = newMemberData.role.toUpperCase();

      await api.post(`/teams/${id}/members?user_id_to_add=${userData.id}&role=${roleUppercase}`,
         payload,
      );

      toast({
        title: "Success",
        description: "Team member added successfully.",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to add team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    newRole: TeamMemberRole,
  ) => {
    try {
      await api.put(`/teams/${id}/members/${memberId}`,
        { role: newRole },
      );

      toast({
        title: "Success",
        description: "Member role updated successfully.",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast({
        title: "Error",
        description: "Failed to update member role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(
        `/teams/${id}/members/${memberId}`,
      );

      toast({
        title: "Success",
        description: "Team member removed successfully.",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to remove team member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
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

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "user.fullname",
      header: "Name",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="font-medium">
            {member.user?.fullname || member.user?.email || "Unknown user"}
          </div>
        );
      },
    },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="text-muted-foreground">{member.user?.email}</div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as TeamMemberRole;
        return <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>;
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined At",
      cell: ({ row }) => {
        const date = row.getValue("joinedAt") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        if (member.role === "owner") return null;

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMember(member.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (session?.access_token) {
      fetchTeamMembers();
    }
  }, [session?.access_token]);

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={fetchTeamMembers}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <AddTeamMemberForm
            onAddMember={handleAddMember}
            isAddingMember={isAddingMember}
          />

          <DataTable
            columns={columns}
            data={members}
            isLoading={isLoading}
            searchPlaceholder="Search members..."
            emptyMessage="No members found. Add your first team member to get started."
          />
        </div>
      </div>
    </main>
  );
}
