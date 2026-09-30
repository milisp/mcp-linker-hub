import Link from "next/link";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { Button } from "@/components/ui/button";
import { getBillingProducts } from "@/lib/server/billing";
export const dynamic = "force-dynamic";

export default function PricingPage() {
  const products = getBillingProducts();
  return (
    <main
      id="main-content"
      className="container mx-auto max-w-5xl px-6 py-16 space-y-10"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Managed MCP plans</h1>
        <p className="text-lg text-muted-foreground">
          Use hosted tools with credentials managed by MCP Linker. Choose a plan
          for your request allowance.
        </p>
        <Button asChild variant="outline">
          <Link href="/hosting">View available services</Link>
        </Button>
      </div>
      {products.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <section
              key={product.slug}
              className="rounded-xl border bg-card p-6 space-y-5"
            >
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-3xl font-bold">{product.priceLabel}</p>
              <p>
                {product.dailyRequestLimit.toLocaleString()} gateway requests
                per day
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Platform-managed upstream credentials</li>
                <li>Revocable personal access keys</li>
                <li>Shared allowance across your devices</li>
              </ul>
              <CheckoutButton plan={product.slug} />
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-8 text-center space-y-3">
          <h2 className="text-xl font-semibold">
            Hosting plans are being prepared
          </h2>
          <p className="text-muted-foreground">
            Paid checkout will be available when hosting products are
            configured. You can continue browsing the directory.
          </p>
          <Button asChild>
            <Link href="/servers">Browse MCP servers</Link>
          </Button>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        The checkout shows the final price and billing terms. Request allowances
        count MCP protocol requests, including initialization and tool
        discovery. Upstream errors can still consume an allowance.
      </p>
    </main>
  );
}
