"use client";

import { ServerResponse } from "@/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import useSWR from "swr";

export function ServerTabs({ server }: { server: ServerResponse }) {
  // Define a fetcher function
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  // Derive the raw URL based on the server source
  const rawUrl = (() => {
    try {
      if (server.source.includes("github.com")) {
        const url = new URL(server.source);
        const parts = url.pathname.split("/");

        if (parts.length === 3) {
          // Handle URLs like https://github.com/owner/repo
          const owner = parts[1];
          const repo = parts[2];
          const branch = "main";
          const path = "README.md";
          return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
        }

        if (parts.length >= 5 && (parts[3] === "tree" || parts[3] === "blob")) {
          const owner = parts[1];
          const repo = parts[2];
          const branch = parts[4];
          let path = parts.slice(5).join("/");

          if (!/\.[a-zA-Z0-9]+$/.test(path)) {
            path = path.endsWith("/")
              ? path + "README.md"
              : path + "/README.md";
          }

          return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
        }
      }
    } catch (error) {
      console.error("Error parsing server source:", error);
    }
    return null;
  })();

  // Use useSWR with 1-hour cache duration
  const { data, error, isLoading } = useSWR(rawUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 60 * 60 * 1000, // 1 hour in milliseconds
    dedupingInterval: 60 * 60 * 1000, // 1 hour deduplication
  });

  // Set the content based on the SWR data or initial description
  const content = isLoading
    ? "Loading description..."
    : error
      ? server.description || "Failed to load description."
      : data || server.description || "No description available.";

  return (
    <Tabs defaultValue="about">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="about">Overview</TabsTrigger>
        <TabsTrigger value="tools">
          Tools ({(server.tools && server.tools.length) || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="about"
        className="mt-4 prose dark:prose-invert max-w-none"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </TabsContent>

      <TabsContent value="tools" className="mt-4">
        <div className="grid gap-4">
          {server.tools?.map((tool) => (
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
    </Tabs>
  );
}
