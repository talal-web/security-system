"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading } = useMe();
  const { selectedAreaId, isAreaLoading } = useSelectedArea();

  const role = data?.user?.role;
  const search = searchParams.toString();
  const routeAreaId = searchParams.get("area");

  useEffect(() => {
    if (isLoading || isAreaLoading || !role) return;

    const routeMap: Record<string, string> = {
      admin: "/dashboard/admin",
      developer: "/dashboard/admin",
      clerk: "/dashboard/clerk",
      supervisor: "/dashboard/supervisor",
    };

    const target = routeMap[role] ?? "/dashboard/unauthorized";

    // Keep the URL's area; only fall back to context if absent.
    const areaId = routeAreaId ?? selectedAreaId;

    const params = new URLSearchParams(search);

    if (areaId) {
      params.set("area", areaId);
    } else {
      params.delete("area");
    }

    const query = params.toString();
    const destination = query ? `${target}?${query}` : target;
    const currentUrl = `${pathname}${search ? `?${search}` : ""}`;

    console.log("[Dashboard redirect check]", {
      currentUrl,
      destination,
      routeAreaId,
      selectedAreaId,
      areaId,
      role,
    });

    if (currentUrl === destination) return;

    router.replace(destination, { scroll: false });
  }, [
    isLoading,
    isAreaLoading,
    role,
    routeAreaId,
    selectedAreaId,
    search,
    pathname,
    router,
  ]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">
          Loading area dashboard...
        </p>
      </div>
    </div>
  );
}
