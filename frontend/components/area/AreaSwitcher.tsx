"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useSelectedArea } from "@/components/area/AreaContext";

export default function AreaSwitcher() {
  const { availableAreas, selectedAreaId, setSelectedAreaId, isAreaLoading } =
    useSelectedArea();

  if (isAreaLoading) {
    return (
      <div className="flex h-10 min-w-36 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-200" />
        <span className="text-sm text-slate-400">Loading areas...</span>
      </div>
    );
  }

  if (!availableAreas.length) {
    return (
      <div
        className="flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm text-amber-700"
        title="No active areas are available to this user"
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">No areas available</span>
      </div>
    );
  }

  return (
    <div className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm shadow-sm">
      <MapPin className="h-4 w-4 shrink-0 text-blue-600" />

      <span className="hidden text-slate-500 sm:inline">Area:</span>

      <div className="relative flex min-w-0 flex-1 items-center">
        <select
          value={selectedAreaId ?? ""}
          onChange={(event) => {
            const nextId = event.target.value;
            if (nextId) setSelectedAreaId(nextId);
          }}
          aria-label="Select active area"
          className="w-full min-w-0 max-w-40 cursor-pointer appearance-none truncate bg-transparent py-2 pr-6 font-semibold text-slate-900 outline-none"
        >
          {availableAreas.map((area) => (
            <option key={area._id} value={String(area._id)}>
              {area.name}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-slate-500" />
      </div>
    </div>
  );
}
