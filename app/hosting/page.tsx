"use client";
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

type Hosting = {
  keys: { id: string; createdAt: string; expiresAt: string }[];
  services: { id: string; name: string }[];
};
async function load(): Promise<Hosting> {
  const response = await fetch("/api/hosting");
  if (!response.ok) throw new Error("Unable to load hosting settings");
  return response.json();
}
export default function HostingPage() {
  const { session, isLoading } = useAuth();
  const { data, error, mutate } = useSWR(session ? "hosting" : null, load);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function createKey() {
    setBusy(true);
    setMessage("");
    setToken("");
    try {
      const response = await fetch("/api/hosting", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create key");
      setToken(result.token);
      await mutate();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  async function revoke(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/hosting?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Unable to revoke key");
      setToken("");
      await mutate();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main
      id="main-content"
      className="container mx-auto max-w-3xl px-6 py-12 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold">Hosted MCP</h1>
        <p className="mt-3 text-muted-foreground">
          Connect to managed tools with an MCP Linker access key. Upstream
          credentials stay on our servers.
        </p>
      </div>
      {isLoading ? (
        <p>Loading account...</p>
      ) : !session ? (
        <Button asChild>
          <Link href="/account/login?redirect=/hosting">
            Sign in to manage access
          </Link>
        </Button>
      ) : (
        <>
          {(error || message) && (
            <p role="alert" className="text-destructive">
              {message || error.message}
            </p>
          )}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Available services</h2>
            {!data ? (
              <p>Loading services...</p>
            ) : !data.services.length ? (
              <p className="text-muted-foreground">
                No hosted services are available yet. Browse the directory or
                check back after the hosting pilot launches.
              </p>
            ) : (
              data.services.map((service) => (
                <div className="rounded-lg border p-4" key={service.id}>
                  <h3 className="font-medium">{service.name}</h3>
                  <code className="block mt-2 break-all">
                    {typeof window === "undefined"
                      ? ""
                      : window.location.origin}
                    /mcp/{service.id}
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use your access key as the Bearer token.
                  </p>
                </div>
              ))
            )}
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Access keys</h2>
            <p className="text-sm text-muted-foreground">
              Keys expire after 90 days. Each account can have up to five active
              keys. Request limits apply across all keys.
            </p>
            <Button
              onClick={createKey}
              disabled={busy || !data?.services.length}
            >
              Create access key
            </Button>
            {token && (
              <div className="rounded-lg border p-4 space-y-2">
                <p>Copy this key now. It is only shown once.</p>
                <code className="block break-all">{token}</code>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(token);
                      setMessage("Key copied");
                    } catch {
                      setMessage("Select and copy the key manually");
                    }
                  }}
                >
                  Copy key
                </Button>
              </div>
            )}
            {data?.keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <code>{key.id.slice(0, 8)}</code>
                  <p className="text-sm text-muted-foreground">
                    Expires {new Date(key.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => revoke(key.id)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
