import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProjectInfoSectionProps {
  form: UseFormReturn<any>;
}

export function ProjectInfoSection({ form }: ProjectInfoSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://github.com/username/project"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/logo.png" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
