// src/app/page.tsx

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
    </main>
  );
}
