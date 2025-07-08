import {
  EarlyAccessForm,
  ImageCarousel,
  QuickStartGuide,
} from "@/components/common";
import { NewsList } from "@/components/common/NewsList";
import { SubmitSection } from "@/components/features/submit-server";
import { FeaturedServers } from "@/components/sections";
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

        {/* Main CTA Section - Focus on Pro/Team */}
        <div className="my-12 flex justify-center flex-col items-center gap-8">
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
            <p className="text-sm text-gray-500 mt-2">
              No credit card required
            </p>
          </div>

          {/* Secondary Options */}
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px bg-gray-300 dark:bg-gray-600 w-16"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="h-px bg-gray-300 dark:bg-gray-600 w-16"></div>
          </div>

          <div className="flex gap-4 items-center flex-wrap justify-center">
            {/* Move Early Access to bottom with clear explanation */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Want to be notified about new features?
              </p>
              <EarlyAccessForm />
            </div>
          </div>
        </div>

        <ImageCarousel />

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
