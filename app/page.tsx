import { EarlyAccessForm, ImageCarousel, QuickStartGuide } from "@/components/common";
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

        <div className="my-8 flex justify-center flex-col items-center gap-6">
          <EarlyAccessForm />
          <div className="flex items-center gap-4">
            <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="h-px bg-gray-300 dark:bg-gray-600 w-12"></div>
          </div>
          <div className="flex gap-2 items-center">
          <a 
            href="/pricing" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <span>🚀</span>
            Start 7-Day Pro or Team Trial
          </a>
          or
          <a 
            href="https://github.com/milisp/mcp-linker/releases" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <span>🚀</span>
            Download and try - No Credit Card Needed
          </a></div>
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
