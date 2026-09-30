import Link from "next/link";
import { getCurrentUser } from "@/lib/server/auth";
import { getBillingStatus } from "@/lib/server/billing";
export const dynamic = "force-dynamic";
export default async function Billing() {
  const user = await getCurrentUser();
  if (!user)
    return (
      <main className="container mx-auto max-w-3xl px-6 py-12">
        <Link href="/account/login">Sign in to view billing</Link>
      </main>
    );
  const billing = getBillingStatus(user.id);
  return (
    <main
      id="main-content"
      className="container mx-auto max-w-3xl px-6 py-12 space-y-6"
    >
      <h1 className="text-3xl font-bold">Your plans</h1>
      <p>
        {billing.active
          ? `Your allowance is ${billing.dailyRequestLimit} gateway requests per day.`
          : "No active hosting plan."}
      </p>
      {billing.entitlements.map((plan, index) => (
        <section
          key={`${plan.plan}-${index}`}
          className="rounded-lg border p-4 space-y-2"
        >
          <h2 className="text-xl font-semibold">{plan.name}</h2>
          <p>
            {plan.active ? "Active" : "Inactive"} · {plan.status}
          </p>
          {plan.expiresAt && (
            <p>
              Access ends {new Date(plan.expiresAt).toLocaleDateString("en-US")}
            </p>
          )}
        </section>
      ))}
      <Link href="/pricing" className="underline">
        View available plans
      </Link>
      <p className="text-sm text-muted-foreground">
        Payment and subscription records are managed by Polar. New purchases
        appear after verified payment updates arrive.
      </p>
    </main>
  );
}
