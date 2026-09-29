"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";

export default function DashboardPage() {
  const router = useRouter();
  const { data } = useMe();
  const { selectedAreaId } = useSelectedArea();

  useEffect(() => {
    const role = data?.user?.role;

    if (!role) return;

    const routeMap = {
      admin: "/dashboard/admin",
      developer: "/dashboard/admin",
      clerk: "/dashboard/clerk",
      supervisor: "/dashboard/supervisor",
    };

    const target =
      routeMap[role as keyof typeof routeMap] ?? "/dashboard/unauthorized";
    const suffix = selectedAreaId ? `?area=${selectedAreaId}` : "";

    router.replace(`${target}${suffix}`);
  }, [data?.user?.role, router, selectedAreaId]);

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
