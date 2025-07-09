import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Log a deeplink click event to Supabase
export async function logDeeplinkClick({
  supabase,
  repo,
  name,
  config,
  autoSubmit,
  source,
}: {
  supabase: any;
  repo?: string;
  name?: string;
  config?: string;
  autoSubmit: boolean;
  source: "auto" | "manual";
}) {
  // Insert a new record into the deeplink_clicks table
  const { error } = await supabase.from("deeplink_clicks").insert({
    repo: repo,
    name: name,
    config: config,
    auto_submit: autoSubmit,
    source,
    user_agent: navigator.userAgent,
    referer: document.referrer,
  });
  if (error) {
    console.error("Supabase insert error:", error);
  }
}
