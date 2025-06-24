"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!checkoutId) return;

    // Call your backend API to confirm the checkout
    // fetch(`/api/checkout/${checkoutId}`)
    //   .then(res => {
    //     if (!res.ok) throw new Error('Failed to verify checkout')
    //     return res.json()
    //   })
    //   .then(data => {
    //     if (data.status === 'confirmed') {
    //       setStatus('success')
    //     } else {
    //       setStatus('error')
    //     }
    //   })
    //   .catch(() => {
    //     setStatus('error')
    //   })
    console.log(checkoutId);
    setStatus("success");
  }, [checkoutId]);

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold">Payment Result</h1>
      {status === "loading" && <p>Verifying your payment...</p>}
      {status === "success" && (
        <p className="text-green-600">✅ Payment confirmed! Thank you.</p>
      )}
      {status === "error" && (
        <p className="text-red-600">❌ Payment verification failed.</p>
      )}
    </div>
  );
}
