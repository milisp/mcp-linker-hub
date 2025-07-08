"use client";

import InstallAppTabs from "@/components/common/InstallAppTabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InstallApp() {
  const searchParams = useSearchParams();
  const autoSubmitParam =
    searchParams.get("autoSubmit") === "true" ? "&autoSubmit=true" : "";
  const configParam = searchParams.get("config");
  const repo = searchParams.get("repo") ?? "";
  const [deeplink, setDeeplink] = useState("");
  const [installUrl, setInstallUrl] = useState("");

  // State for textarea input and base64 output
  const [jsonInput, setJsonInput] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [jsonError, setJsonError] = useState("");
  // State for serverName extracted from JSON
  const [serverName, setServerName] = useState<string>(
    searchParams.get("name") ?? "",
  );

  useEffect(() => {
    if (repo) {
      setDeeplink(`mcp-linker://install-app?repo=${repo}${autoSubmitParam}`);
    } else {
      setDeeplink(
        `mcp-linker://install-app?name=${serverName}&config=${configParam}${autoSubmitParam}`,
      );
    }
  }, []);

  // Handle textarea change
  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    try {
      // Try to parse JSON
      const obj = JSON.parse(value);
      // Extract serverName: support both top-level and mcpServers, and both 'command' and 'url'
      let extractedServerName = "";
      // Helper function to find key with 'command' or 'url'
      function findServerName(obj: any) {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val && typeof val === "object" && (val.command || val.url)) {
              return key;
            }
          }
        }
        return "";
      }
      if (obj.mcpServers && typeof obj.mcpServers === "object") {
        // If mcpServers exists, extract from it
        extractedServerName = findServerName(obj.mcpServers);
      } else {
        // Otherwise, extract from top-level
        extractedServerName = findServerName(obj);
      }
      setServerName(extractedServerName);
      // Convert to base64
      const base64 = btoa(JSON.stringify(obj));
      setBase64Output(`<a href="${location.origin}/install-app?name=${extractedServerName}&config=${base64}">
          <img src="https://img.shields.io/badge/mcp-linker-add-%F0%9F%94%8D%20Click%20Here-blue?logo=link&style=for-the-badge" alt="mcp-linker-add" />
        </a>`);
      setJsonError("");
    } catch (err) {
      setBase64Output("");
      setJsonError("Invalid JSON");
      setServerName("");
    }
  };

  useEffect(() => {
    if (!jsonInput) {
      setBase64Output("");
      setJsonError("");
      setServerName("");
      return;
    }
    try {
      const obj = JSON.parse(jsonInput);
      // Extract serverName: support both top-level and mcpServers, and both 'command' and 'url'
      let extractedServerName = "";
      // Helper function to find key with 'command' or 'url'
      function findServerName(obj: any) {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val && typeof val === "object" && (val.command || val.url)) {
              return key;
            }
          }
        }
        return "";
      }
      if (obj.mcpServers && typeof obj.mcpServers === "object") {
        // If mcpServers exists, extract from it
        extractedServerName = findServerName(obj.mcpServers);
      } else {
        // Otherwise, extract from top-level
        extractedServerName = findServerName(obj);
      }
      setServerName(extractedServerName);
      // Convert to base64
      const base64 = btoa(JSON.stringify(obj));
      setBase64Output(`<a href="${location.origin}/install-app?name=${extractedServerName}&config=${base64}">
          <img src="https://img.shields.io/badge/mcp-linker-add-%F0%9F%94%8D%20Click%20Here-blue?logo=link&style=for-the-badge" alt="mcp-linker-add" />
        </a>`);
      setJsonError("");
    } catch (err) {
      setBase64Output("");
      setJsonError("Invalid JSON");
      setServerName("");
    }
  }, [jsonInput]);

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
            MCP Linker Deeplink
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
