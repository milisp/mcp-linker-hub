import { Card, CardContent } from "@/components/ui/card";
import { ServerResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Download, Star, PenToolIcon as ToolIcon } from "lucide-react";
import { RelatedServers } from "./related-servers";

interface PageProps {
  server: ServerResponse;
}

export function MetricsCard({ server }: PageProps) {
  return (
    <Card className="backdrop-blur-sm bg-background/60 border-muted">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Star className="h-5 w-5 text-yellow-500 mb-1" />
            <div className="font-medium">
              {server.githubStars.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">GitHub Stars</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <Download className="h-5 w-5 mb-1" />
            <div className="font-medium">
              {server.downloads.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Downloads</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <ToolIcon className="h-5 w-5 mb-1" />
            <div className="font-medium">
              {server.tools && server.tools.length}
            </div>
            <div className="text-xs text-muted-foreground">Tools</div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <div className="font-medium">
              {formatDistanceToNow(new Date(server.updatedAt), {
                addSuffix: true,
              })}
            </div>
            <div className="text-xs text-muted-foreground">Last Updated</div>
          </div>
        </div>

        {/* Related Servers */}
        <RelatedServers />
      </CardContent>
    </Card>
  );
}
