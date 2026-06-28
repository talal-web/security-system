"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, MapPin } from "lucide-react";

import { ILocation } from "@/types/location";

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
      className={`
        flex items-center gap-4
        rounded-xl border bg-white
        px-4 py-3
        transition-all

        ${
          isDragging
            ? "shadow-xl ring-2 ring-primary z-50 opacity-90 scale-[1.02]"
            : "hover:border-primary/40 hover:shadow-md"
        }
      `}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          cursor-grab
          active:cursor-grabbing

          rounded-lg
          p-2

          text-muted-foreground
          hover:bg-muted
          transition
        "
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-medium">{location.name}</h3>

        {location.address && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />

            <span className="truncate">{location.address}</span>
          </p>
        )}
      </div>

      {/* Order Badge */}
      <div
        className="
          rounded-full
          bg-muted
          px-3
          py-1

          text-xs
          font-semibold
        "
      >
        #{location.sortOrder}
      </div>
    </div>
  );
}
