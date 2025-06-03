import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface MCPConfigSectionProps {
  form: UseFormReturn<any>;
}

export function MCPConfigSection({ form }: MCPConfigSectionProps) {
  const [jsonError, setJsonError] = React.useState<string>("");
  const [textareaValue, setTextareaValue] = React.useState<string>("");

  // Default configuration as requested by user
  const defaultConfig = {
    mcpServers: {
      "server-name": {
        command: "uvx",
        args: ["new-mcp"],
      },
    },
  };

  // Initialize textarea value and form
  React.useEffect(() => {
    const currentValue = form.getValues("mcpServers");
    if (!currentValue || Object.keys(currentValue).length === 0) {
      // Set default configuration
      form.setValue("mcpServers", defaultConfig.mcpServers);
      setTextareaValue(JSON.stringify(defaultConfig, null, 2));
    } else {
      // Set existing value
      const wrappedValue = { mcpServers: currentValue };
      setTextareaValue(JSON.stringify(wrappedValue, null, 2));
    }
  }, [form]);

  const validateAndSetMcpConfig = (jsonString: string) => {
    setTextareaValue(jsonString);

    if (!jsonString.trim()) {
      form.setValue("mcpServers", {});
      setJsonError("");
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);

      // Check if the input has the wrapped format {mcpServers: {...}}
      let serversConfig;
      if (parsed.mcpServers && typeof parsed.mcpServers === "object") {
        serversConfig = parsed.mcpServers;
      } else if (typeof parsed === "object" && parsed !== null) {
        // Assume it's already in the correct format
        serversConfig = parsed;
      } else {
        setJsonError("Configuration must be an object");
        return;
      }

      // Validate the structure of each server config
      for (const [serverName, config] of Object.entries(serversConfig)) {
        if (!config || typeof config !== "object") {
          setJsonError(
            `Server '${serverName}' configuration must be an object`,
          );
          return;
        }

        const configObj = config as any;

        // Check if it's SSE/HTTP config
        if (configObj.type === "http" || configObj.type === "sse") {
          if (!configObj.url || typeof configObj.url !== "string") {
            setJsonError(
              `Server '${serverName}' with type '${configObj.type}' must have a valid URL`,
            );
            return;
          }
          try {
            new URL(configObj.url);
          } catch {
            setJsonError(`Server '${serverName}' has invalid URL format`);
            return;
          }
        } else {
          // Assume it's stdio config - check for required fields
          if (!configObj.command || typeof configObj.command !== "string") {
            setJsonError(`Server '${serverName}' must have a 'command' field`);
            return;
          }
          if (!configObj.args || !Array.isArray(configObj.args)) {
            setJsonError(`Server '${serverName}' must have an 'args' array`);
            return;
          }
          if (configObj.env && typeof configObj.env !== "object") {
            setJsonError(`Server '${serverName}' 'env' must be an object`);
            return;
          }
        }
      }

      form.setValue("mcpServers", serversConfig);
      setJsonError("");
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      validateAndSetMcpConfig(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      setJsonError("Failed to read clipboard or clipboard is empty");
    }
  };

  const defaultMcpConfigExample = JSON.stringify(defaultConfig, null, 2);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="mcpServers"
        render={({ field }) => (
          <FormItem>
            <FormDescription>
              Provide the MCP server configuration in JSON format. You can use
              either format:
              <br />• Direct format:{" "}
              <code>{`{"server-name": {"command": "node", "args": ["server.js"]}}`}</code>
              <br />• Wrapped format:{" "}
              <code>{`{mcpServers: {"server-name": {...}}}`}</code>
            </FormDescription>
            <FormControl>
              <div className="flex items-start space-x-2">
                <Textarea
                  placeholder={defaultMcpConfigExample}
                  className="min-h-[200px] font-mono text-sm flex-grow"
                  value={textareaValue}
                  onChange={(e) => validateAndSetMcpConfig(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePaste}
                >
                  Paste
                </Button>
              </div>
            </FormControl>
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <Collapsible>
        <CollapsibleTrigger className="text-sm underline hover:text-primary">
          Show Configuration Examples
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-muted/50 p-4 rounded-lg mt-2">
          <h4 className="text-sm font-medium mb-2">Configuration Examples:</h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Stdio Server (Direct format):</p>
              <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                {`{
  "server-name": {
    "command": "node",
    "args": ["server.js"],
    "env": { "API_KEY": "key" }
  }
}`}
              </pre>
              <p className="font-medium mt-3">Stdio Server (Wrapped format):</p>
              <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                {`{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["server.js"],
      "env": { "API_KEY": "key" }
    }
  }
}`}
              </pre>
            </div>
            <div>
              <p className="font-medium">HTTP/SSE Server (Direct format):</p>
              <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                {`{
  "server-name": {
    "type": "sse",
    "url": "http://localhost:3000/sse"
  }
}`}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
