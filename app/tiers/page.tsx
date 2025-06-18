import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Tiers - MCP Linker Hub",
  description: "Choose the perfect plan for your MCP server management needs. From free open-source to enterprise solutions.",
};

const tiers = [
  {
    name: "Open Source",
    price: "Free",
    icon: "🆓",
    description: "Perfect for individual developers getting started",
    features: [
      "5 client synchronizations (sufficient for most users)",
      "Basic configuration management",
      "Local storage",
      "Community support",
      "Open source code access"
    ],
    popular: false,
    ctaText: "Get Started",
    ctaVariant: "outline" as const
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    icon: "💼",
    description: "Enhanced features for professional developers",
    features: [
      "Cloud encrypted backup",
      "Multi-device synchronization",
      "Configuration template library",
      "Automatic configuration validation",
      "Priority support",
      "Advanced analytics"
    ],
    popular: true,
    ctaText: "Start Free Trial",
    ctaVariant: "default" as const
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    icon: "👥",
    description: "Collaboration tools for development teams",
    features: [
      "Team configuration sharing",
      "Permission management",
      "Usage statistics & insights",
      "Team collaboration tools",
      "Admin dashboard",
      "24/7 priority support",
      "Custom integrations",
      "Advanced security features"
    ],
    popular: false,
    ctaText: "Contact Sales",
    ctaVariant: "outline" as const
  }
];

export default function TiersPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
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
          {tiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                tier.popular 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:shadow-lg'
              }`}
            >
              {tier.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600"
                >
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
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
                </div>
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

                <Button 
                  className="w-full" 
                  variant={tier.ctaVariant}
                  size="lg"
                >
                  {tier.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Can I switch plans anytime?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing adjustments.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Is there a free trial for paid plans?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, both Professional and Team plans come with a 14-day free trial. 
                No credit card required to start.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We accept all major credit cards, PayPal, and can arrange invoicing for enterprise customers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Do you offer custom enterprise plans?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, we offer custom enterprise solutions with advanced security features, 
                dedicated support, and custom integrations. Contact our sales team for details.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who trust MCP Linker Hub for their 
              Model Context Protocol server management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}