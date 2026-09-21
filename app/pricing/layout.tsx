import type { Metadata } from "next";
import type React from "react";

// The app is open source and needs no account, so the plans are a leftover
// people can still reach but nobody searches for. Keep the page working,
// keep it out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
