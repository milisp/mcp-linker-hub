"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTeamMemberData, TeamMemberRole } from "@/types";
import { Mail, Plus } from "lucide-react";
import { useState } from "react";

interface AddTeamMemberFormProps {
  onAddMember: (newMember: AddTeamMemberData) => void;
  isAddingMember: boolean;
}

export function AddTeamMemberForm({
  onAddMember,
  isAddingMember,
}: AddTeamMemberFormProps) {
  const [newMemberData, setNewMemberData] = useState<AddTeamMemberData>({
    email: "",
    role: "member",
  });

  const handleAddClick = () => {
    onAddMember(newMemberData);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Member
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter member's email"
            value={newMemberData.email}
            onChange={(e) =>
              setNewMemberData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={newMemberData.role}
            onValueChange={(value: TeamMemberRole) =>
              setNewMemberData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={handleAddClick}
        disabled={isAddingMember || !newMemberData.email.trim()}
        className="w-full md:w-auto"
      >
        <Mail className="mr-2 h-4 w-4" />
        {isAddingMember ? "Adding..." : "Add Member"}
      </Button>
    </div>
  );
}
