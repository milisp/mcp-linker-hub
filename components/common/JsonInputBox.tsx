import { Textarea } from "@/components/ui";
import { ClipboardPaste } from "lucide-react";
import React from "react";

interface JsonInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// JSON input box with paste button and error display
const JsonInputBox: React.FC<JsonInputBoxProps> = ({
  value,
  onChange,
  error,
}) => (
  <div className="relative w-full">
    <Textarea
      rows={12}
      className="w-full font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded pr-10"
      placeholder="Enter mcp config JSON here"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {/* Paste button for JSON input */}
    <button
      type="button"
      className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
      onClick={async () => {
        try {
          const text = await navigator.clipboard.readText();
          onChange(text);
        } catch (err) {
          // Clipboard API error
        }
      }}
      title="Paste from clipboard"
    >
      <ClipboardPaste className="w-5 h-5 text-gray-500" />
    </button>
    {error && <div className="text-red-600 font-medium">{error}</div>}
  </div>
);

export default JsonInputBox;
