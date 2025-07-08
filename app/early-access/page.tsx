"use client";

import { EarlyAccessForm } from "@/components/common/EarlyAccessForm";

export default function EarlyAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Stay in the Loop</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get notified when we release new features, integrations, and updates.
          This is for product announcements only – not for Pro or Team trials.
        </p>
      </div>

      <EarlyAccessForm />

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-3">
          Looking for Pro or Team features?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          If you want to try our advanced features, you don't need to join the
          early access list.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <span>🚀</span>
            Start Pro/Team Trial
          </a>
          <a
            href="https://github.com/milisp/mcp-linker/releases"
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200"
          >
            <span>📦</span>
            Download Free Version
          </a>
        </div>
      </div>
    </div>
  );
}
