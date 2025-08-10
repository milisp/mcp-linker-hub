"use client";

import { EarlyAccessFeedBackForm } from "@/components/EarlyAccessFeedback";

export default function FeedbackPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
        <EarlyAccessFeedBackForm />
      </div>
    )
}