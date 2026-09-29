"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Building2 } from "lucide-react";

import { useSelectedArea } from "@/components/area/AreaContext";

export default function AreaSwitcher() {
  const router = useRouter();
  const { availableAreas, selectedAreaId, getAreaAwareHref } =
    useSelectedArea();

  if (!availableAreas.length) {
    return null;
  }

  return (
    <div className="relative flex items-center">
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="hidden md:inline">Area</span>

        <select
          value={selectedAreaId ?? ""}
          onChange={(event) => {
            const nextId = event.target.value || null;
            if (!nextId) return;

            const url = new URL(window.location.href);
            url.pathname = "/dashboard";
            url.searchParams.set("area", nextId);

            router.push(`${url.pathname}${url.search}`);
          }}
          className="bg-transparent pr-1 text-sm font-semibold text-slate-900 outline-none"
        >
          {availableAreas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.name}
            </option>
          ))}
        </select>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </div>

      <Link
        href={getAreaAwareHref("/dashboard")}
        className="ml-3 hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 md:inline-flex"
      >
        <Building2 className="h-4 w-4" />
        Dashboard
      </Link>
    </div>
  );
}
