"use client";

import { useSupabase } from "@/components/providers/supabase-provider";
import { useState } from "react";

interface EarlyAccessFormProps {
  onSuccess?: () => void;
}

export function EarlyAccessForm({ onSuccess }: EarlyAccessFormProps) {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("early_access_emails")
        .insert([{ email }]);
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
      <div className="text-green-600 text-center">
        <div className="text-lg">✅ You're on the list!</div>
        <div className="text-sm mt-1">
          We'll notify you when new features are available
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-600 text-white rounded px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          {loading ? "..." : "Notify Me"}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        Get notified about new features and updates (not for Pro/Team trials)
      </p>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
}
