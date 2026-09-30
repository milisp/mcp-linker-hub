import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Analytics excludes config values because they may contain credentials.
export async function logDeeplinkClick({
  repo,
  name,
  autoSubmit,
  source,
}: {
  repo?: string;
  name?: string;
  config?: string;
  autoSubmit: boolean;
  source: "auto" | "manual";
}) {
  try {
    await fetch("/api/deeplink-clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo, name, auto_submit: autoSubmit, source }),
    });
  } catch {
    /* Analytics must never block installation. */
  }
}
