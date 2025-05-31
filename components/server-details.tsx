"use client";

import { useSupabase } from "@/components/supabase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Copy,
  Database,
  Download,
  ExternalLink,
  Github,
  Heart,
  Star,
  PenToolIcon as ToolIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ServerDetailsProps {
  server: {
    id: string;
    name: string;
    author: string;
    description: string;
    longDescription: string;
    tags: string[];
    githubStars: number;
    downloads: number;
    toolCount: number;
    imageUrl: string;
    githubUrl: string;
    documentation: string;
    createdAt: string;
    updatedAt: string;
    tools: {
      name: string;
      description: string;
    }[];
  };
}

export function ServerDetails({ server }: ServerDetailsProps) {
  const { session } = useSupabase();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFavorite = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }

    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${server.name} has been ${isFavorite ? "removed from" : "added to"} your favorites`,
    });
  };

  const copyServerUrl = () => {
    navigator.clipboard.writeText(
      `https://mcp-server-hub.vercel.app/server/${server.id}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
              <Image
                src={server.imageUrl || "/placeholder.svg"}
                alt={server.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold">{server.name}</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={copyServerUrl}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy link</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full ${isFavorite ? "text-red-500" : ""}`}
                    onClick={toggleFavorite}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    <span className="sr-only">Favorite</span>
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">by {server.author}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {server.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg">{server.description}</p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={server.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </Button>
            </Link>
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
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="tools">
                Tools ({server.tools.length})
              </TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
            </TabsList>
            <TabsContent
              value="about"
              className="mt-4 prose dark:prose-invert max-w-none"
            >
              <ReactMarkdown>{server.longDescription}</ReactMarkdown>
            </TabsContent>
            <TabsContent value="tools" className="mt-4">
              <div className="grid gap-4">
                {server.tools.map((tool) => (
                  <Card key={tool.name}>
                    <CardContent className="p-4">
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tool.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="installation" className="mt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Using Cursor</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`{
  "mcpServers": {
    "${server.name}": {
      "url": "https://api.example.com/mcp/${server.id}"
    }
  }
}`}
                  </pre>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Using Claude Desktop</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`claude mcp add ${server.name} https://api.example.com/mcp/${server.id}`}
                  </pre>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Using the AI SDK</h3>
                <div className="bg-muted rounded-md p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`import { createMcpClient } from "@ai-sdk/mcp";

const client = createMcpClient({
  url: "https://api.example.com/mcp/${server.id}"
});`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-background/60 border-muted">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-500 mb-1" />
                  <div className="font-medium">
                    {server.githubStars.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    GitHub Stars
                  </div>
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
                  <div className="font-medium">{server.tools.length}</div>
                  <div className="text-xs text-muted-foreground">Tools</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">
                    {formatDistanceToNow(new Date(server.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last Updated
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Related Servers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <Link
                        href="/server/2"
                        className="text-sm font-medium hover:underline"
                      >
                        PostgreSQL MCP Server
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        by PostgreSQL
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <Link
                        href="/server/3"
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
                        href="/server/4"
                        className="text-sm font-medium hover:underline"
                      >
                        MongoDB MCP Server
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        by MongoDB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
