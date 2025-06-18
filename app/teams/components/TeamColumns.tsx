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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TeamResponse } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";

interface TeamColumnsProps {
  onEdit: (team: TeamResponse) => void;
  onDelete: (teamId: string) => void;
  onManageMembers: (team: TeamResponse) => void;
}

export function useTeamColumns({
  onEdit,
  onDelete,
  onManageMembers,
}: TeamColumnsProps): ColumnDef<TeamResponse>[] {
  return [
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null;
        return (
          <div className="max-w-[200px] truncate">
            {description || (
              <span className="text-muted-foreground">No description</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) =>
        new Date(row.getValue("updatedAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const team = row.original;

        return (
          <div className="flex items-center space-x-2">
            {/* Manage Members Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/teams/${team.id}`}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Manage Members</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Edit Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(team)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Team</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Delete Button with AlertDialog */}
            <AlertDialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete Team</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the team "{team.name}" and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(team.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
}
