"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { BasicInfoSection } from "@/components/submit/BasicInfoSection";
import { MCPConfigSection } from "@/components/submit/MCPConfigSection";
import { ProjectInfoSection } from "@/components/submit/ProjectInfoSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { API_V1_URL } from "@/lib/api";
import { FlexibleMcpServersSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CATEGORIES, type CategoryName } from "./type";

// Form validation schema
const SubmitFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  developer: z.string().min(1, "Developer is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.enum(
    CATEGORIES.filter((cat) => cat !== "All") as [
      CategoryName,
      ...CategoryName[],
    ],
  ),
  projectUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  mcpServers: FlexibleMcpServersSchema,
});

type SubmitFormData = z.infer<typeof SubmitFormSchema>;

const FORM_STORAGE_KEY = "mcp-submit-form-data";

export default function SubmitPage() {
  const { toast } = useToast();
  const { session } = useSupabase();
  const defaultValues: SubmitFormData = {
    name: "",
    developer: "",
    description: "",
    tags: [],
    category: "Utility",
    projectUrl: "",
    logoUrl: "",
    mcpServers: {},
  };

  const form = useForm<SubmitFormData>({
    resolver: zodResolver(SubmitFormSchema),
    defaultValues,
  });

  // Load saved form data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }, [form]);

  // Save form data to localStorage whenever form changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const buildConfigs = (mcpServers: Record<string, any>) => {
    const result = [];
    for (const [serverName, config] of Object.entries(mcpServers)) {
      console.log("Server Name:", serverName);
      console.log("Config:", config);
      if ("command" in config) {
        config.type = "stdio";
      } else {
        config.type = "sse";
      }
      result.push(config);
    }

    return result;
  };

  const onSubmit = async (data: SubmitFormData) => {
    try {
      if (!session?.access_token) {
        toast({
          title: "Authentication required",
          description: "Please log in to submit a server",
          variant: "destructive",
        });
        return;
      }

      const requestData = {
        name: data.name,
        description: data.description,
        developer: data.developer,
        source: data.projectUrl || "",
        logo_url: data.logoUrl || null,
        cat: data.category,
        tags: data.tags,
        configs: buildConfigs(data.mcpServers),
      };
      console.log("Submitting:", requestData);

      await axios.post(`${API_V1_URL}/servers/`, requestData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Submit successful",
        description: "Your MCP server has been submitted successfully!",
      });

      // Clear saved data after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);

      // Reset form
      form.reset(defaultValues);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during submission",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit MCP Server</h1>
        <p className="text-muted-foreground mt-2">
          Share your MCP server with the community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection form={form} />
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectInfoSection form={form} />
            </CardContent>
          </Card>

          {/* MCP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>MCP Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <MCPConfigSection form={form} />
            </CardContent>
          </Card>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Submit Server"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
