import { CATEGORIES } from "@/app/servers/submit/type";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const [tagInput, setTagInput] = React.useState("");

  const addTag = () => {
    if (tagInput.trim() && !form.getValues("tags").includes(tagInput.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag: string) => tag !== tagToRemove),
    );
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter server name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="developer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developer *</FormLabel>
            <FormControl>
              <Input placeholder="Enter developer name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what your MCP server does..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CATEGORIES.filter((cat) => cat !== "All").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={() => {
          const [inputValue, setInputValue] = React.useState(
            form.getValues("tags")?.join(", ") || "",
          );

          const handleInputChange = (
            e: React.ChangeEvent<HTMLInputElement>,
          ) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            const tags = newValue
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
            form.setValue("tags", tags);
          };

          return (
            <FormItem>
              <FormLabel>Tags (comma separated) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. openai, api, mcp"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
