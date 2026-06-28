"use client";

import { ArrowUpDown, Building2, Check, X } from "lucide-react";

import type { ILocation, LocationSector } from "@/types/location";

import LocationCard from "./LocationCard";
import LocationSortableList from "../reorder/LocationSortableList";

interface LocationSectorProps {
  sectorName: string;

  sectorLabel: string;

  items: ILocation[];

  reorderSector: LocationSector | null;

  reorderItems: ILocation[];

  setReorderSector: (sector: LocationSector | null) => void;

  setReorderItems: React.Dispatch<React.SetStateAction<ILocation[]>>;

  handleSaveOrder: () => void;

  isSavingOrder: boolean;
}

export default function LocationSector({
  sectorName,
  sectorLabel,
  items,

  reorderSector,
  reorderItems,

  setReorderSector,
  setReorderItems,

  handleSaveOrder,
  isSavingOrder,
}: LocationSectorProps) {
  const isReordering = reorderSector === sectorName;

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
            <Building2 size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold">{sectorLabel}</h2>

            <p className="text-xs text-slate-500">
              {items.length} location{items.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {isReordering ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSavingOrder}
              onClick={() => setReorderSector(null)}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              disabled={isSavingOrder}
              onClick={handleSaveOrder}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Check size={16} />
              {isSavingOrder ? "Saving..." : "Save Order"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setReorderSector(sectorName as LocationSector);

              setReorderItems(
                [...items].sort((a, b) => a.sortOrder - b.sortOrder),
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:bg-slate-50"
          >
            <ArrowUpDown size={16} />
            Reorder
          </button>
        )}
      </div>

      {isReordering ? (
        <div className="p-6">
          <LocationSortableList
            locations={reorderItems}
            onChange={setReorderItems}
          />
        </div>
      ) : (
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((location) => (
            <LocationCard key={location._id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
}
