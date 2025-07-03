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
      <div className="text-green-600">Thank you for joining early access!</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded px-3 py-2"
      >
        {loading ? "Submitting..." : "Join Early Access"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
