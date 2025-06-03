import { Database } from "lucide-react";
import Link from "next/link";

export function RelatedServers() {
  return (
    <div className="pt-4 border-t">
      <h3 className="font-medium mb-2">Related Servers</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <Link
              href="/servers/2"
              className="text-sm font-medium hover:underline"
            >
              PostgreSQL MCP Server
            </Link>
            <p className="text-xs text-muted-foreground">by PostgreSQL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <Link
              href="/servers/3"
              className="text-sm font-medium hover:underline"
            >
              MySQL MCP Server
            </Link>
            <p className="text-xs text-muted-foreground">by MySQL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <Link
              href="/servers/4"
              className="text-sm font-medium hover:underline"
            >
              MongoDB MCP Server
            </Link>
            <p className="text-xs text-muted-foreground">by MongoDB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
