import { Switch } from "@/components/ui/switch";
import React from "react";

interface BadgePreviewProps {
  badgeUrl: string;
  autoSubmit: boolean;
  setAutoSubmit: (checked: boolean) => void;
}

// Badge preview with image and autoSubmit switch
const BadgePreview: React.FC<BadgePreviewProps> = ({
  badgeUrl,
  autoSubmit,
  setAutoSubmit,
}) => {
  if (!badgeUrl) return null;
  return (
    <div className="mb-2 flex items-center gap-2">
      {/* Preview badge as image */}
      <a href={badgeUrl} target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/badge/mcp--linker-add-blue?style=for-the-badge"
          alt="mcp-linker-add"
          className="h-8"
        />
      </a>
      autoSubmit
      {/* Switch to control autoSubmit param */}
      <Switch checked={autoSubmit} onCheckedChange={setAutoSubmit} />
    </div>
  );
};

export default BadgePreview;
