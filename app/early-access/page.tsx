"use client";

import { EarlyAccessForm } from "@/components/common/EarlyAccessForm";

export default function EarlyAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Join Early Access</h1>
      <div className="my-8 flex justify-center flex-col items-center gap-6">
        <EarlyAccessForm />
        <div className="flex items-center gap-4">
          <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <span>🚀</span>
          Upgrade to Pro or Team
        </a>
      </div>
    </div>
  );
}
