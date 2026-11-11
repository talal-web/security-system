"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, MapPin } from "lucide-react";

import { ILocation } from "@/types/location";
import { cn } from "@/lib/utils";

interface LocationSortableItemProps {
  location: ILocation;
}

export default function LocationSortableItem({
  location,
}: LocationSortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,

    transform,
    transition,

    isDragging,
  } = useSortable({
    id: location._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5 sm:gap-4 sm:px-4",
        isDragging
          ? "z-50 border-blue-300 opacity-95 shadow-pop ring-2 ring-blue-500/30"
          : "border-slate-200 shadow-card hover:border-slate-300",
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-slate-900">
          {location.name}
        </h3>

        {location.address && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0" />

            <span className="truncate">{location.address}</span>
          </p>
        )}
      </div>

      {/* Order Badge */}
      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/15">
        #{location.sortOrder}
      </span>
    </div>
  );
}
