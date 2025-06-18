"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMember, TeamMemberRole } from "@/types";
import { Trash2 } from "lucide-react";

interface TeamMembersListProps {
  members: TeamMember[];
  isLoading: boolean;
  handleUpdateMemberRole: (memberId: string, newRole: TeamMemberRole) => void;
  handleRemoveMember: (memberId: string) => void;
  getRoleBadgeVariant: (
    role: TeamMemberRole,
  ) => "default" | "secondary" | "outline";
}

export function TeamMembersList({
  members,
  isLoading,
  handleUpdateMemberRole,
  handleRemoveMember,
  getRoleBadgeVariant,
}: TeamMembersListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Current Members ({members.length || 0})</h3>
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading members...
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No members found.
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="font-medium">
                    {member.user?.fullname ||
                      member.user?.email ||
                      "Unknown user"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
                {member.role !== "owner" && (
                  <div className="flex space-x-1">
                    <Select
                      value={member.role}
                      onValueChange={(value: TeamMemberRole) =>
                        handleUpdateMemberRole(member.id, value)
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove Team Member
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            {member.user?.fullname || member.user?.email} from
                            the team? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
