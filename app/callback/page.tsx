"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const query = searchParams.toString();
      const deepLinkUrl = `mcp-linker://auth/callback?${query}`;
      window.location.href = deepLinkUrl;
    }
  }, [searchParams]);

  return (
    <div style={{ maxWidth: 600, margin: "100px auto", padding: 16 }}>
      login success, you can close this page now.
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
