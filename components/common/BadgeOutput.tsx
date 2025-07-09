import { Textarea } from "@/components/ui";
import { Copy } from "lucide-react";
import React, { useState } from "react";

interface BadgeOutputProps {
  badgeHtml: string;
  badgeMarkdown: string;
}

// Badge output for HTML and Markdown with copy buttons
const BadgeOutput: React.FC<BadgeOutputProps> = ({
  badgeHtml,
  badgeMarkdown,
}) => {
  // State for copied status
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Handler for HTML copy
  const handleCopyHtml = async () => {
    const htmlTextarea = document.getElementById(
      "badge-html-textarea",
    ) as HTMLTextAreaElement;
    if (htmlTextarea) {
      await navigator.clipboard.writeText(htmlTextarea.value);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1500); // Reset after 1.5s
    }
  };

  // Handler for Markdown copy
  const handleCopyMarkdown = async () => {
    const mdTextarea = document.getElementById(
      "badge-markdown-textarea",
    ) as HTMLTextAreaElement;
    if (mdTextarea) {
      await navigator.clipboard.writeText(mdTextarea.value);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 1500); // Reset after 1.5s
    }
  };

  return (
    <>
      {badgeMarkdown && (
        <div className="relative w-full mb-4">
          {/* Markdown badge textarea and copy button */}
          <Textarea
            rows={4}
            value={badgeMarkdown}
            readOnly
            className="pr-10"
            id="badge-markdown-textarea"
          />
          {/* Copy button for markdown badge */}
          <button
            type="button"
            className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
            onClick={handleCopyMarkdown}
            title="Copy markdown badge to clipboard"
          >
            {copiedMarkdown ? (
              // Show 'Copied' text when copied
              <span className="text-green-600 font-medium">Copied</span>
            ) : (
              <Copy className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      )}
      {badgeHtml && (
        <div className="relative w-full mb-4">
          {/* HTML badge textarea and copy button */}
          <Textarea
            rows={8}
            value={badgeHtml}
            readOnly
            className="pr-10"
            id="badge-html-textarea"
          />
          {/* Copy button for HTML badge */}
          <button
            type="button"
            className="absolute right-2 top-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
            onClick={handleCopyHtml}
            title="Copy HTML badge to clipboard"
          >
            {copiedHtml ? (
              // Show 'Copied' text when copied
              <span className="text-green-600 font-medium">Copied</span>
            ) : (
              <Copy className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default BadgeOutput;
