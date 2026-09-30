import Link from "next/link";
import { getCurrentUser } from "@/lib/server/auth";
import { getBillingStatus } from "@/lib/server/billing";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function SuccessPage() {
  const user = await getCurrentUser();
  const billing = user ? getBillingStatus(user.id) : null;
  return (
    <main className="container mx-auto max-w-xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">
        {billing?.active ? "Your plan is active" : "Confirming your purchase"}
      </h1>
      <p>
        {billing?.active
          ? `Your account includes up to ${billing.dailyRequestLimit} hosted requests per day.`
          : user
            ? "Access appears after Polar confirms payment through a verified webhook. If you just paid, refresh this page shortly."
            : "Sign in to check your account's access."}
      </p>
      <Link href={user ? "/hosting" : "/account/login"} className="underline">
        {user ? "Open hosted tools" : "Sign in"}
      </Link>
    </main>
  );
}
