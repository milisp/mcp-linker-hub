"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ plan }: { plan: string }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    if (!session) {
      router.push("/account/login?redirect=/pricing");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/checkout?plan=${encodeURIComponent(plan)}`,
        { method: "POST" },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.detail || "Checkout unavailable");
      window.location.assign(result.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout unavailable");
      setBusy(false);
    }
  }
  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        disabled={busy || isLoading}
        onClick={checkout}
      >
        {busy ? "Opening checkout..." : "Subscribe"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
