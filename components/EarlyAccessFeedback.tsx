"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { useState } from "react";
import { z } from "zod";
import { Textarea } from "./ui";

const FeedbackSchema = z.object({
  email: z.string().email().optional(),
  usage: z.string().min(10, "Please provide more detailed feedback"),
  intent: z.enum(["free", "solo", "team_pro", "enterprise"], {
    errorMap: () => ({
      message: "Please select how you plan to use MCP-Linker",
    }),
  }),
  source: z.enum(
    ["github", "reddit", "ai", "twitter", "search", "friend", "other"],
    {
      errorMap: () => ({
        message: "Please tell us where you heard about MCP-Linker",
      }),
    },
  ),
});

interface EarlyAccessFeedBackFormProps {
  onSuccess?: () => void;
}

export function EarlyAccessFeedBackForm({
  onSuccess,
}: EarlyAccessFeedBackFormProps) {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<string>("");
  const [intent, setIntent] = useState<string>("");
  const [source, setSource] = useState<string>("");
  // Add errorMap state for field-specific errors
  const [errorMap, setErrorMap] = useState<{ [key: string]: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorMap({}); // Clear previous field errors
    const parseResult = FeedbackSchema.safeParse({
      email,
      usage: formData,
      intent,
      source,
    });

    if (!parseResult.success) {
      // Map errors to fields
      const newErrorMap: { [key: string]: string } = {};
      parseResult.error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          newErrorMap[err.path[0]] = err.message;
        }
      });
      setErrorMap(newErrorMap);
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.from("early_access_feedback").insert([
        {
          email,
          usage: formData,
          intent,
          source,
        },
      ]);
      if (error) throw error;
      setSuccess(true);
      setEmail("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-2xl text-green-600 mb-2">🎉 Thank you!</div>
        <div className="text-base text-gray-700 dark:text-gray-200">
          You're on the list!
          <br />
          We'll notify you when new features are available.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">How do you plan to use MCP-Linker?</option>
          <option value="free">Just for myself (free)</option>
          <option value="solo">Just for myself (Pro)</option>
          <option value="team_pro">For a team</option>
          <option value="enterprise">Enterprise or large team</option>
        </select>
        {errorMap.intent && (
          <div className="text-red-600 text-xs -mt-3 mb-1">
            {errorMap.intent}
          </div>
        )}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Where did you hear about MCP-Linker?</option>
          <option value="github">GitHub</option>
          <option value="reddit">Reddit</option>
          <option value="ai">AI</option>
          <option value="twitter">Twitter/X</option>
          <option value="search">Search Engine</option>
          <option value="friend">Friend or coworker</option>
          <option value="other">Other</option>
        </select>
        {errorMap.source && (
          <div className="text-red-600 text-xs -mt-3 mb-1">
            {errorMap.source}
          </div>
        )}
        <Textarea
          name="usage"
          placeholder="features request or feedback (required)"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          className="resize-none min-h-[60px]"
        />
        {errorMap.usage && (
          <div className="text-red-600 text-xs -mt-3 mb-1">
            {errorMap.usage}
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (option for feedback)"
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {errorMap.email && (
          <div className="text-red-600 text-xs -mt-3 mb-1">
            {errorMap.email}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !intent || !source || !formData || !email}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
      {error && (
        <div className="text-red-600 text-sm mt-4 text-center">❌ {error}</div>
      )}
    </div>
  );
}
