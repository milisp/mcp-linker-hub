"use client";

import { useState } from "react";
import BadgeOutput from "./BadgeOutput";
import BadgePreview from "./BadgePreview";
import ExampleConfig from "./ExampleConfig";
import JsonInputBox from "./JsonInputBox";

// Helper to generate badge URL
function getBadgeUrl(
  origin: string,
  serverName: string,
  autoSubmit: boolean,
  base64: string,
) {
  // Generate the badge link URL
  return `${origin}/install-app?name=${serverName}${autoSubmit ? "&autoSubmit=true" : ""}&config=${base64}`;
}

// Helper to generate badge HTML
function getBadgeHtml(badgeUrl: string) {
  // Generate the HTML code for the badge
  return `<a href="${badgeUrl}">\n  <img src=\"https://img.shields.io/badge/mcp--linker-add-blue?logo=link&style=for-the-badge\" alt=\"mcp-linker-add\" />\n  </a>`;
}

// Helper to generate badge Markdown
function getBadgeMarkdown(badgeUrl: string) {
  // Generate the Markdown code for the badge
  return `[![mcp-linker-add](https://img.shields.io/badge/mcp--linker-add-blue?logo=link&style=for-the-badge)](${badgeUrl})`;
}

export default function JsonToBadgeConverter() {
  // State for textarea input and base64 output
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [serverName, setServerName] = useState<string>("");
  // State for autoSubmit param
  const [autoSubmit, setAutoSubmit] = useState(false);
  // State for badge outputs
  const [badgeUrl, setBadgeUrl] = useState("");
  const [badgeHtml, setBadgeHtml] = useState("");
  const [badgeMarkdown, setBadgeMarkdown] = useState("");

  // Handle textarea change and JSON to badge conversion
  const handleJsonInputChange = (
    value: string,
    autoSubmitOverride?: boolean,
  ) => {
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
      // Use autoSubmitOverride if provided (for switch), else use current state
      const auto =
        autoSubmitOverride !== undefined ? autoSubmitOverride : autoSubmit;
      // Generate badge URL, HTML, and Markdown
      const url = getBadgeUrl(
        location.origin,
        extractedServerName,
        auto,
        base64,
      );
      setBadgeUrl(url);
      setBadgeHtml(getBadgeHtml(url));
      setBadgeMarkdown(getBadgeMarkdown(url));
      setJsonError("");
    } catch (err) {
      setBadgeUrl("");
      setBadgeHtml("");
      setBadgeMarkdown("");
      setJsonError("Invalid JSON");
      setServerName("");
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        Convert mcp server config to badge for share
      </h3>
      <JsonInputBox
        value={jsonInput}
        onChange={handleJsonInputChange}
        error={jsonError}
      />
      <BadgePreview
        badgeUrl={badgeUrl}
        autoSubmit={autoSubmit}
        setAutoSubmit={(checked: boolean) => {
          setAutoSubmit(checked);
          handleJsonInputChange(jsonInput, checked);
        }}
      />
      <BadgeOutput badgeHtml={badgeHtml} badgeMarkdown={badgeMarkdown} />
      <ExampleConfig />
    </div>
  );
}
