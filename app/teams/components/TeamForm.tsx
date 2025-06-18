import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TeamFormData } from "@/types";

interface TeamFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  formData: TeamFormData;
  setFormData: (data: TeamFormData) => void;
  isSubmitting: boolean;
  title: string;
  description: string;
  submitButtonText: string;
}

export function TeamForm({
  isOpen,
  onOpenChange,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  title,
  description,
  submitButtonText,
}: TeamFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter team name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter team description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
