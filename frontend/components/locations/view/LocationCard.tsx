"use client";

import { MapPin, Pencil } from "lucide-react";

import { ILocation } from "@/types/location";
import { Button } from "@/components/ui/Button";

interface LocationCardProps {
  location: ILocation;
  onEdit: (id: string) => void;
}

export default function LocationCard({ location, onEdit }: LocationCardProps) {
  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-3 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50/60">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
            <MapPin className="size-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-slate-900">
              {location.name}
            </h3>

            <p className="truncate text-xs text-slate-500">
              {location.address || "No address"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(location._id)}
          title="Edit Location"
          aria-label={`Edit ${location.name}`}
          className="text-slate-500 hover:text-blue-600"
        >
          <Pencil />
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-2.5 border-t border-slate-100 pt-2">
        <span className="font-mono text-[11px] text-slate-400">
          #{location._id.slice(-6).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
