"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";

import LoginModal from "@/components/authentication/LoginModal";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRequested = searchParams.get("login") === "true";

  const handleCloseLogin = () => {
    setLoginOpen(false);

    if (loginRequested) {
      router.replace("/", { scroll: false });
    }
  };

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <HeroSection onLoginClick={() => setLoginOpen(true)} />

        <StatsSection />

        <FeaturesSection />
      </main>

      <LoginModal
        open={loginOpen || loginRequested}
        onClose={handleCloseLogin}
      />
    </>
  );
}
