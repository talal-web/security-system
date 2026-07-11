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

  onEdit: (id: string) => void;
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

  onEdit,
}: LocationSectorProps) {
  const isReordering = reorderSector === sectorName;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
            <Building2 size={18} />
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              {sectorLabel}
            </h2>

            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              {items.length}
            </span>
          </div>
        </div>

        {isReordering ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSavingOrder}
              onClick={() => setReorderSector(null)}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={15} />
              Cancel
            </button>

            <button
              type="button"
              disabled={isSavingOrder}
              onClick={handleSaveOrder}
              className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={15} />
              {isSavingOrder ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={items.length <= 1}
            onClick={() => {
              setReorderSector(sectorName as LocationSector);

              setReorderItems(
                [...items].sort((a, b) => a.sortOrder - b.sortOrder),
              );
            }}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowUpDown size={15} />
            Reorder
          </button>
        )}
      </div>

      {isReordering ? (
        <div className="p-5">
          <LocationSortableList
            locations={reorderItems}
            onChange={setReorderItems}
          />
        </div>
      ) : (
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((location) => (
            <LocationCard
              key={location._id}
              location={location}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
