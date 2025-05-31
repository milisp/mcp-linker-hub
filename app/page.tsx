import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ServerGrid } from "@/components/server-grid"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <CategoryNav />
        <ServerGrid />
        <Footer />
      </div>
    </main>
  )
}
