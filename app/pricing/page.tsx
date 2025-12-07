"use client";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ANNUAL_SUBSCRIPTION_PLANS,
  LIFETIME_PLANS,
  SUBSCRIPTION_PLANS,
  type Plan,
} from "@/lib/plans";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function TiersPage() {
  // State for tab selection
  const [tab, setTab] = useState("monthly");

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
          defaultValue="monthly"
          className="mb-8"
        >
          <TabsList className="flex justify-center gap-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (-20%)</TabsTrigger>
            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
          </TabsList>
        </Tabs>

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
                {/* Show trial button for paid plans (exclude Lifetime) */}
                {tier.name !== "Open Source" && tier.name !== "Lifetime" && (
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
                {/* CTA button logic remains the same */}
                {tier.name === "Lifetime" ? (
                  <a
                    href={
                      process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                        ? "https://buy.polar.sh/polar_cl_7P6ZeE0DtWrLrlWLzljS3xqMgsRa7YGB4Ie650kBWM3"
                        : "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_s6ISF00Z5EWhRsnowjMDQrsEWhv5tBgrrqotP1JzSc4/redirect"
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
                ) : tier.name === "Professional" ? (
                  <a
                    href={
                      process.env.NEXT_PUBLIC_POLAR_ENVIRONMENT === "production"
                        ? tab === "annual"
                          ? "https://buy.polar.sh/polar_cl_VUbETUofhLdRWNV2yoNvp3RCQy5aewbCeC8bf1vD81G"
                          : "https://buy.polar.sh/polar_cl_PJb89mnkRzbGgJ1xpuvvUn3HU8kdrqhudvhYv110mOX"
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
                    href={
                      tab === "annual"
                        ? "https://buy.polar.sh/polar_cl_wzcIiFNw9qcGFQdI5Yxri6f7u1gTzdTTk2Ugd1cBgAI"
                        : "https://buy.polar.sh/polar_cl_Kp5TMFDbWfloIl45KlGuOHULyUJ24E8WXjf1b0C3O9D"
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
