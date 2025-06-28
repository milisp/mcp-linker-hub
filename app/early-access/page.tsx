"use client";

import { EarlyAccessForm } from "@/components/common/EarlyAccessForm";

export default function EarlyAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Join Early Access</h1>
      <EarlyAccessForm />
    </div>
  );
}
