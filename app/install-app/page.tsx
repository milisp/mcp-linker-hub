"use client";

import InstallAppTabs from "@/components/common/InstallAppTabs";
import { useSupabase } from "@/components/providers/supabase-provider";
import { logDeeplinkClick } from "@/lib/utils"; // Import shared logDeeplinkClick
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InstallApp() {
  const searchParams = useSearchParams();
  const autoSubmitParam =
    searchParams.get("autoSubmit") === "true" ? "&autoSubmit=true" : "";
  const configParam = searchParams.get("config");
  const repo = searchParams.get("repo") ?? "";
  const serverName = searchParams.get("name") ?? "";
  const [deeplink, setDeeplink] = useState("");
  const { supabase } = useSupabase();

  useEffect(() => {
    if (repo) {
      setDeeplink(`mcp-linker://install-app?repo=${repo}${autoSubmitParam}`);
      logDeeplinkClick({
        supabase,
        repo,
        name: serverName,
        config: configParam || undefined,
        autoSubmit: autoSubmitParam === "&autoSubmit=true",
        source: "auto",
      });
    } else if (serverName && configParam) {
      setDeeplink(
        `mcp-linker://install-app?name=${serverName}&config=${configParam}${autoSubmitParam}`,
      );
      // Automatically open the deeplink after setting it
      window.location.href = `mcp-linker://install-app?name=${serverName}&config=${configParam}${autoSubmitParam}`;

      logDeeplinkClick({
        supabase,
        repo,
        name: serverName,
        config: configParam || undefined,
        autoSubmit: autoSubmitParam === "&autoSubmit=true",
        source: "auto",
      });
      
    }
  }, []);

  // Decode configParam from base64 to JSON object
  let decodedConfig: any = null;
  let decodeError = "";
  if (configParam) {
    try {
      // Decode base64 and parse JSON
      const jsonStr = atob(configParam);
      decodedConfig = JSON.parse(jsonStr);
    } catch (err) {
      decodeError = "Invalid base64 or JSON in configParam";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            MCP Linker Deeplink and badge maker
          </h1>
        </div>
        <InstallAppTabs
          deeplink={deeplink}
          configParam={configParam}
          autoSubmitParam={autoSubmitParam}
          decodedConfig={decodedConfig}
          decodeError={decodeError}
        />
      </div>
    </div>
  );
}
