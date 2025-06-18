"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { useAuthedApi } from "@/hooks/useAuthedApi";
import { TeamFormData, TeamListResponse, TeamResponse } from "@/types";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTeamColumns } from "./components/TeamColumns";
import { TeamForm } from "./components/TeamForm";

export default function Teams() {
  const { session } = useSupabase();
  const api = useAuthedApi();
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamResponse | null>(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamResponse | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchMyTeams = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<TeamListResponse>(
        "/teams/my_teams",
      );
      setTeams(data.teams);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teams. Please try again.",
        variant: "destructive",
      });
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append("name", formData.name.trim());
      if (formData.description.trim()) {
        params.append("description", formData.description.trim());
      }

      await api.post<TeamResponse>(
        `/teams/`,
        {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        },
      );

      toast({
        title: "Success",
        description: "Team created successfully.",
      });

      setIsCreateOpen(false);
      setFormData({ name: "", description: "" });
      fetchMyTeams();
    } catch (error) {
      console.error("Failed to create team:", error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeam = async () => {
    if (!editingTeam || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append("name", formData.name.trim());
      if (formData.description.trim()) {
        params.append("description", formData.description.trim());
      }

      await api.put<TeamResponse>(
        `/teams/${editingTeam.id}?${params.toString()}`,
      );

      toast({
        title: "Success",
        description: "Team updated successfully.",
      });

      setIsEditOpen(false);
      setEditingTeam(null);
      setFormData({ name: "", description: "" });
      fetchMyTeams();
    } catch (error) {
      console.error("Failed to update team:", error);
      toast({
        title: "Error",
        description: "Failed to update team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await api.delete(
        `/teams/${teamId}`,
      );

      toast({
        title: "Success",
        description: "Team deleted successfully.",
      });

      fetchMyTeams();
    } catch (error) {
      console.error("Failed to delete team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (team: TeamResponse) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || "",
    });
    setIsEditOpen(true);
  };

  const openMembersDialog = (team: TeamResponse) => {
    setSelectedTeam(team);
    setIsMembersOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingTeam(null);
  };

  const columns = useTeamColumns({
    onEdit: openEditDialog,
    onDelete: handleDeleteTeam,
    onManageMembers: openMembersDialog,
  });

  useEffect(() => {
    fetchMyTeams();
  }, []);

  return (
    <main className="bg-white rounded-t-3xl min-h-[60vh] py-8 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Teams</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={fetchMyTeams}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={teams}
          isLoading={isLoading}
          searchPlaceholder="Search teams..."
          emptyMessage="No teams found. Create your first team to get started."
        />

        <TeamForm
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreateTeam}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          title="Create New Team"
          description="Create a new team to collaborate with your colleagues."
          submitButtonText="Create Team"
        />

        <TeamForm
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={handleEditTeam}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          title="Edit Team"
          description="Update your team information."
          submitButtonText="Update Team"
        />
      </div>
    </main>
  );
}
