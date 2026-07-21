// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";

import LoginModal from "@/components/authentication/LoginModal";

export default function HomePage() {
  const searchParams = useSearchParams();

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <HeroSection onLoginClick={() => setLoginOpen(true)} />

        <StatsSection />

        <FeaturesSection />
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
