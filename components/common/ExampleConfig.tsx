import React from "react";

// Example configs for display
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
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-sequential-thinking"
    ]
  }
}`;

const ExampleConfig: React.FC = () => (
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
);

export default ExampleConfig;
