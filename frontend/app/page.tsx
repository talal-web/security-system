"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, MapPin, ShieldCheck } from "lucide-react";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import LoginModal from "@/components/authentication/LoginModal";
import { useMe } from "@/hooks/auth/useMe";
import { useAreas } from "@/hooks/area/useArea";
import { useSelectedArea } from "@/components/area/AreaContext";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRequested = searchParams.get("login") === "true";

  const { data: userData } = useMe();
  const { data: allAreas = [] } = useAreas({ isActive: true });
  const { selectedAreaId } = useSelectedArea();

  const userRole = userData?.user?.role;
  const userAreaIds = userData?.user?.areas ?? [];

  const accessibleAreas = useMemo(() => {
    if (!allAreas.length) return [];

    if (userRole === "admin" || userRole === "developer") {
      return allAreas;
    }

    return allAreas.filter((area) => userAreaIds.includes(area._id));
  }, [allAreas, userAreaIds, userRole]);

  const handleCloseLogin = () => {
    setLoginOpen(false);

    if (loginRequested) {
      router.replace("/", { scroll: false });
    }
  };

  return (
    <>
      <div className="overflow-x-hidden bg-slate-50 text-slate-900">
        <HeroSection onLoginClick={() => setLoginOpen(true)} />

        {userData?.user && accessibleAreas.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Area Workspace
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Select an Area to continue
                </h2>
              </div>

              {selectedAreaId && (
                <Link
                  href={`/dashboard?area=${selectedAreaId}`}
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Open selected Area
                </Link>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {accessibleAreas.map((area) => (
                <Link
                  key={area._id}
                  href={`/dashboard?area=${area._id}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 to-red-500" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {userRole === "admin" || userRole === "developer"
                        ? "All Access"
                        : "Assigned"}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {area.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {area.description ||
                        "Operations area for employees, attendance, sectors, and locations."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      Area workspace
                    </span>

                    <span className="inline-flex items-center gap-2 text-blue-600 transition group-hover:translate-x-1">
                      Open
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <FeaturesSection />
      </div>

      <LoginModal
        open={loginOpen || loginRequested}
        onClose={handleCloseLogin}
      />
    </>
  );
}
