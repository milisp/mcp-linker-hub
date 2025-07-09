"use client";

import { Textarea } from "@/components/ui";
import { Switch } from "@/components/ui/switch";
import { ClipboardPaste, Copy } from "lucide-react";
import { useState } from "react";

export default function JsonToBadgeConverter() {
  // State for textarea input and base64 output
  const [jsonInput, setJsonInput] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [serverName, setServerName] = useState<string>("");
  // State for autoSubmit param
  const [autoSubmit, setAutoSubmit] = useState(false);

  // Handle textarea change and JSON to badge conversion
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
      // Add autoSubmit param if enabled
      const autoSubmitParam = autoSubmit ? "&autoSubmit=true" : "";
      setBase64Output(
        `<a href="${location.origin}/install-app?name=${extractedServerName}${autoSubmitParam}&config=${base64}">\n          <img src="https://img.shields.io/badge/mcp-linker-add-%F0%9F%94%8D%20Click%20Here-blue?logo=link&style=for-the-badge" alt="mcp-linker-add" />\n        </a>`,
      );
      setJsonError("");
    } catch (err) {
      setBase64Output("");
      setJsonError("Invalid JSON");
      setServerName("");
    }
  };

  const example = `{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": [
        "blender-mcp"
      ]
    }
  }
}`;
  const example2 = `{
  "sequential-thinking": {
    "command": "npx"
    "args": [
      "-y",
      "@modelcontextprotocol/server-sequential-thinking"
    ]
  }
}`;

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">
        Convert mcp server config to badge for share
      </h3>
      <div className="relative w-full">
        <Textarea
          rows={12}
          className="w-full font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded pr-10"
          placeholder="Enter mcp config JSON here"
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            handleJsonInputChange(e);
          }}
        />
        {/* Paste button for JSON input */}
        <button
          type="button"
          className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setJsonInput(text);
              handleJsonInputChange({
                target: { value: text },
              } as React.ChangeEvent<HTMLTextAreaElement>);
            } catch (err) {
              // Clipboard API error
            }
          }}
          title="Paste from clipboard"
        >
          <ClipboardPaste className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      {jsonError && <div className="text-red-600 font-medium">{jsonError}</div>}
      {base64Output && (
        <div className="mb-2 flex items-center gap-2">
          {/* Preview badge as image */}
          <a
            href={`/install-app?name=${serverName}${autoSubmit ? "&autoSubmit=true" : ""}&config=${btoa(jsonInput)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://img.shields.io/badge/mcp--linker-add-blue?style=for-the-badge"
              alt="mcp-linker-add"
              className="h-8"
            />
          </a>
          autoSubmit
          {/* Switch to control autoSubmit param */}
          <Switch checked={autoSubmit} onCheckedChange={setAutoSubmit} />
        </div>
      )}
      {base64Output && (
        <div className="relative w-full">
          <Textarea
            rows={8}
            value={`<a href="${location.origin}/install-app?name=${serverName}${autoSubmit ? "&autoSubmit=true" : ""}&config=${btoa(jsonInput)}">
          <img src="https://img.shields.io/badge/mcp-linker-add-%F0%9F%94%8D%20Click%20Here-blue?logo=link&style=for-the-badge" alt="mcp-linker-add" />
        </a>`}
            readOnly
            className="pr-10"
          />
          {/* Copy button for base64 output */}
          <button
            type="button"
            className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
            onClick={async () => {
              // Copy to clipboard
              try {
                await navigator.clipboard.writeText(base64Output);
              } catch (err) {
                // Clipboard API error
              }
            }}
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-sm font-medium text-gray-700">
            Example mcp config
          </span>
          <pre className="bg-gray-50 rounded p-3 text-xs font-mono border border-gray-200 overflow-x-auto">
            {example}
          </pre>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">
            Example2 mcp config
          </span>
          <pre className="bg-gray-50 rounded p-3 text-xs font-mono border border-gray-200 overflow-x-auto">
            {example2}
          </pre>
        </div>
      </div>
    </div>
  );
}
