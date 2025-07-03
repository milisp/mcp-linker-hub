import { CTA, Faq } from "@/components/tiers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_PLANS } from "@/lib/plans";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Tiers - MCP Linker Hub",
  description:
    "Choose the perfect plan for your MCP server management needs. From free open-source to enterprise solutions.",
};

export default function TiersPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-yellow-100 text-yellow-800 text-sm px-4 py-1 font-medium">
            🚀 Early Access Pricing — Lock in now before official launch
          </span>
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Scale your MCP server management with plans designed for every need.
            From individual developers to enterprise teams.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {SUBSCRIPTION_PLANS.map((tier, index) => (
            <Card
              key={tier.name}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                tier.popular
                  ? "ring-2 ring-blue-500 shadow-lg scale-105"
                  : "hover:shadow-lg"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <CardTitle className="text-2xl font-bold">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                  {tier.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                    {tier.price}
                  </span>
                  {tier.originalPrice && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 line-through">
                      {tier.originalPrice}
                      {tier.period}
                    </div>
                  )}
                  {tier.period && (
                    <span className="text-slate-600 dark:text-slate-400 ml-1">
                      {tier.period}
                    </span>
                  )}
                </div>
                {tier.earlyAccess && (
                  <span className="block text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Early Access Price
                  </span>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {tier.name === "Professional" ? (
                  <a
                    href={
                      process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                        ? "https://buy.polar.sh/polar_cl_PJb89mnkRzbGgJ1xpuvvUn3HU8kdrqhudvhYv110mOX"
                        : "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_5QvMHlN5hLZsJxEZydKoVZUX1Tb8unnUUzAiZ1IdmcU/redirect"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="w-full"
                      variant={tier.ctaVariant}
                      size="lg"
                    >
                      {tier.ctaText}
                    </Button>
                  </a>
                ) : tier.name === "Open Source" ? (
                  <a
                    href="https://github.com/milisp/mcp-linker/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="w-full"
                      variant={tier.ctaVariant}
                      size="lg"
                    >
                      {tier.ctaText}
                    </Button>
                  </a>
                ) : (
                  <a
                    href="https://buy.polar.sh/polar_cl_Kp5TMFDbWfloIl45KlGuOHULyUJ24E8WXjf1b0C3O9D"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <Button
                    className="w-full"
                    variant={tier.ctaVariant}
                    size="lg"
                  >
                    {tier.ctaText}
                  </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Faq />
        <CTA />
      </div>
    </main>
  );
}
