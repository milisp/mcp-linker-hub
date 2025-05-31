"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/components/supabase-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function SubmitServerPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();

  const addTag = () => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a server",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would submit the server to your Supabase database
      // For now, we'll just simulate a successful submission

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Server submitted",
        description: "Your MCP server has been submitted for review.",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description:
          error.message || "Failed to submit server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-sm bg-background/60 border-muted">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  Submit MCP Server
                </CardTitle>
                <CardDescription>
                  Share your MCP server with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Server Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., My Database MCP Server"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your MCP server does and how it helps users..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Repository URL</Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/username/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="e.g., database, postgres"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() => removeTag(t)}
                              className="rounded-full hover:bg-muted p-0.5"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {t} tag</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Server"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <p>All submissions are reviewed before being published.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
