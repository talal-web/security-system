"use client";

import { MapPin, Pencil } from "lucide-react";

import { ILocation } from "@/types/location";

interface LocationCardProps {
  location: ILocation;
  onEdit: (id: string) => void;
}

export default function LocationCard({ location, onEdit }: LocationCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <MapPin size={15} className="text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-800">
              {location.name}
            </h3>

            <p className="truncate text-[11px] text-slate-500">
              {location.address || "No address"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onEdit(location._id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title="Edit Location"
          aria-label={`Edit ${location.name}`}
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-2 border-t border-slate-100 pt-2">
        <span className="text-[10px] font-medium tracking-wide text-slate-400">
          #{location._id.slice(-6).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
