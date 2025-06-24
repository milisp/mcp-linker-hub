import { Button } from "@/components/ui/button";

export function Faq() {
  return (
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
            Yes, you can upgrade or downgrade your plan at any time. Changes
            take effect immediately, and we'll prorate any billing adjustments.
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
            We accept all major credit cards, PayPal, and can arrange invoicing
            for enterprise customers.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Do you offer custom enterprise plans?
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Yes, we offer custom enterprise solutions with advanced security
            features, dedicated support, and custom integrations. Contact our
            sales team for details.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CTA() {
  return (
    <div className="mt-20 text-center">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
          Join thousands of developers who trust MCP Linker Hub for their Model
          Context Protocol server management needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900"
          >
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default {
  Faq,
  CTA,
};
