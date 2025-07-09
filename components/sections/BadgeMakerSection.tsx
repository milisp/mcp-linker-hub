"use client";

import { useState } from "react";
import BadgeMaker from "../common/BadgeMaker";

export function BadgeMakerSection() {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          🏷️ Create your MCP-Linker ADD Badge
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Customize and share a badge to let others discover your MCP server
        </p>
        <button
          onClick={() => setShow(!show)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {show ? "Hide" : "🎯 Open Badge Maker"}
        </button>
      </div>
      {show && (
        <div className="mt-4">
          <BadgeMaker />
        </div>
      )}
    </div>
  );
}
