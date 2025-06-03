'use client';

import { ServerResponse } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export function ServerLinks({ server }: { server: ServerResponse }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Link href={server.source} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          GitHub Repository
        </Button>
      </Link>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          window.location.href = `mcp-linker://servers/${server.id}`;
        }}
      >
        Install
      </Button>
      {server.documentation && (
        <Link
          href={server.documentation}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Documentation
          </Button>
        </Link>
      )}
    </div>
  );
}
