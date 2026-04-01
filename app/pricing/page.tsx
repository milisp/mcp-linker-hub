"use client";

import { CTA, Faq } from "@/components/tiers";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ANNUAL_SUBSCRIPTION_PLANS,
  LIFETIME_PLANS,
  SUBSCRIPTION_PLANS,
  type Plan,
} from "@/lib/plans";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TiersPage() {
  const { session } = useSupabase();
  const router = useRouter();
  // State for tab selection
  const [tab, setTab] = useState("lifetime");

  function handleCheckout(url: string) {
    if (!session) {
      router.push("/account/login?redirect=/pricing");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Select plans based on tab
  const plans: Plan[] =
    tab === "annual"
      ? ANNUAL_SUBSCRIPTION_PLANS
      : tab === "lifetime"
        ? LIFETIME_PLANS
        : SUBSCRIPTION_PLANS;

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

        {/* Pricing Tabs */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          defaultValue="lifetime"
          className="mb-8"
        >
          <TabsList className="flex justify-center gap-4">
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Student Notice */}
        <div className="mb-8 mx-auto max-w-3xl">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Students Get Free Access!
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Register with your <strong>.edu email</strong> to unlock all local features for free -
              including all clients, advanced sync, and configuration management. No credit card required!
            </p>
            <a
              href="https://github.com/milisp/mcp-linker/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full mb-2">
                Signup with .edu email
              </Button>
            </a>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((tier, index) => (
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
                  {tier.period && (
                    <span className="text-slate-600 dark:text-slate-400 ml-1">
                      {tier.period}
                    </span>
                  )}
                  {tier.originalPrice && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 line-through">
                      {tier.originalPrice}
                      {tier.period}
                    </div>
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
                {/* Show trial button for paid plans (exclude Lifetime plans) */}
                {tier.name !== "Open Source" &&
                 tier.name !== "Lifetime Basic" &&
                 tier.name !== "Lifetime Pro" && (
                  <a
                    href="https://github.com/milisp/mcp-linker/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full mb-2" variant={tier.ctaVariant}>
                      Get 14-day free from App
                    </Button>
                  </a>
                )}
                {/* CTA button logic for different plan types */}
                {tier.name === "Lifetime Basic" ? (
                  <Button
                    className="w-full"
                    variant={tier.ctaVariant}
                    size="lg"
                    onClick={() =>
                      handleCheckout(
                        process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                          ? "https://buy.polar.sh/polar_cl_7P6ZeE0DtWrLrlWLzljS3xqMgsRa7YGB4Ie650kBWM3"
                          : "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_LIFETIME_BASIC_SANDBOX_URL_HERE/redirect"
                      )
                    }
                  >
                    {tier.ctaText}
                  </Button>
                ) : tier.name === "Lifetime Pro" ? (
                  <Button
                    className="w-full"
                    variant={tier.ctaVariant}
                    size="lg"
                    onClick={() =>
                      handleCheckout(
                        process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                          ? "https://buy.polar.sh/polar_cl_3lIXfxomFvmVvGKYjFzAUxrVvYKd06Z3Nza1d3QMqou"
                          : "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_1QzUF7EDhrtXdPMCZiyG4pyJ7PG1y666aPc6o0le60P/redirect"
                      )
                    }
                  >
                    {tier.ctaText}
                  </Button>
                ) : tier.name === "Professional" ? (
                  <Button
                    className="w-full"
                    variant={tier.ctaVariant}
                    size="lg"
                    onClick={() =>
                      handleCheckout(
                        process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                          ? tab === "annual"
                            ? "https://buy.polar.sh/polar_cl_VUbETUofhLdRWNV2yoNvp3RCQy5aewbCeC8bf1vD81G"
                            : "https://buy.polar.sh/polar_cl_PJb89mnkRzbGgJ1xpuvvUn3HU8kdrqhudvhYv110mOX"
                          : "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_5QvMHlN5hLZsJxEZydKoVZUX1Tb8unnUUzAiZ1IdmcU/redirect"
                      )
                    }
                  >
                    {tier.ctaText}
                  </Button>
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
                  <Button
                    className="w-full"
                    variant={tier.ctaVariant}
                    size="lg"
                    onClick={() =>
                      handleCheckout(
                        tab === "annual"
                          ? "https://buy.polar.sh/polar_cl_wzcIiFNw9qcGFQdI5Yxri6f7u1gTzdTTk2Ugd1cBgAI"
                          : "https://buy.polar.sh/polar_cl_Kp5TMFDbWfloIl45KlGuOHULyUJ24E8WXjf1b0C3O9D"
                      )
                    }
                  >
                    {tier.ctaText}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Contact Section */}
        <section className="mt-12 text-center">
          <p className="text-lg font-medium">Need something more custom?</p>
          <Button variant="outline" size="lg" className="mt-2" asChild>
            <a href="mailto:milisp@proton.me?subject=Enterprise Plan Inquiry">
              Contact Us for Enterprise
            </a>
          </Button>
        </section>
        <Faq />
        <CTA />
      </div>
    </main>
  );
}
