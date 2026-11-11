"use client";

import { ChevronsUpDown, MapPin } from "lucide-react";
import { useSelectedArea } from "@/components/area/AreaContext";

export default function AreaSwitcher() {
  const { availableAreas, selectedAreaId, setSelectedAreaId, isAreaLoading } =
    useSelectedArea();

  if (isAreaLoading) {
    return (
      <div className="flex h-9 min-w-36 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
        <div className="size-3.5 animate-pulse rounded-full bg-slate-200" />
        <span className="text-sm text-slate-400">Loading areas...</span>
      </div>
    );
  }

  if (!availableAreas.length) {
    return (
      <div
        className="flex h-9 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-sm text-amber-700"
        title="No active areas are available to this user"
      >
        <MapPin className="size-4 shrink-0" />
        <span className="whitespace-nowrap">No areas available</span>
      </div>
    );
  }

  return (
    <label className="group relative flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-sm shadow-card transition hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15">
      <span className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
        <MapPin className="size-3.5" />
      </span>

      <span className="sr-only">Active area</span>

      <select
        value={selectedAreaId ?? ""}
        onChange={(event) => {
          const nextId = event.target.value;
          if (nextId) setSelectedAreaId(nextId);
        }}
        aria-label="Select active area"
        className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-6 font-medium text-slate-900 outline-none"
      >
        {availableAreas.map((area) => (
          <option key={area._id} value={String(area._id)}>
            {area.name}
          </option>
        ))}
      </select>

      <ChevronsUpDown className="pointer-events-none absolute right-2 size-3.5 text-slate-400" />
    </label>
  );
}
