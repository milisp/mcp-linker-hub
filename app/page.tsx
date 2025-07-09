import {
  ImageCarousel,
  QuickStartGuide
} from "@/components/common";
import { NewsList } from "@/components/common/NewsList";
import { EarlyAccessFeedBackForm } from "@/components/EarlyAccessFeedback";
import { SubmitSection } from "@/components/features/submit-server";
import { FeaturedServers } from "@/components/sections";
import { BadgeMakerSection } from "@/components/sections/BadgeMakerSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ProjectHeroSection } from "@/components/sections/ProjectHeroSection";
import { WhyMCPLinkerSection } from "@/components/sections/Why";

export default function Home() {
  return (
    <main className="gradient-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-black/20 pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section - Project Introduction */}
        <ProjectHeroSection />
        <ImageCarousel />
        <BadgeMakerSection />

        {/* Main CTA Section - Focus on Pro/Team */}
        <div className="flex justify-center flex-col items-center gap-8">
          {/* Primary CTA - Pro/Team Trial */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Ready to unlock advanced features?
            </h2>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
            >
              <span>🚀</span>
              Start 7-Day Pro or Team Trial
            </a>
            <p className="text-sm text-black-500 mt-2">
              No credit card required
            </p>
          </div>

          <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
            💡 Tell us what you need
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
            What’s stopping you from trying Pro or Team now? What features do you want?
          </p>
          <EarlyAccessFeedBackForm />
        </div>
        </div>

        <WhyMCPLinkerSection />
        <NewsList />
        <FeaturesSection />
        <FeaturedServers />
        <QuickStartGuide />

        {/* Submit Server Section */}
        <SubmitSection />
      </div>
    </main>
  );
}
