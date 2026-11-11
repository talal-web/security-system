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
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

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

  const accessibleAreas = useMemo(() => {
    if (!allAreas.length) return [];

    if (userRole === "admin" || userRole === "developer") {
      return allAreas;
    }

    const userAreaIds = userData?.user?.areas ?? [];
    return allAreas.filter((area) => userAreaIds.includes(area._id));
  }, [allAreas, userData?.user?.areas, userRole]);

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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Area Workspace
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Select an Area to continue
                </h2>
              </div>

              {selectedAreaId && (
                <ButtonLink
                  href={`/dashboard?area=${selectedAreaId}`}
                  variant="secondary"
                >
                  Open selected Area
                </ButtonLink>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {accessibleAreas.map((area) => (
                <Link
                  key={area._id}
                  href={`/dashboard?area=${area._id}`}
                  className="group flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-card transition-colors duration-200 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                      <Building2 className="size-5" />
                    </div>

                    <Badge
                      tone={
                        userRole === "admin" || userRole === "developer"
                          ? "info"
                          : "neutral"
                      }
                    >
                      {userRole === "admin" || userRole === "developer"
                        ? "All Access"
                        : "Assigned"}
                    </Badge>
                  </div>

                  <div className="mt-5 flex-1">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      {area.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {area.description ||
                        "Operations area for employees, attendance, sectors, and locations."}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-medium text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Area workspace
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-blue-600">
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
