"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { ILocation } from "@/types/location";

import LocationSortableItem from "./LocationSortableItem";

interface LocationSortableListProps {
  locations: ILocation[];

  onChange: (locations: ILocation[]) => void;
}

export default function LocationSortableList({
  locations,
  onChange,
}: LocationSortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = locations.findIndex(
      (location) => location._id === active.id,
    );

    const newIndex = locations.findIndex(
      (location) => location._id === over.id,
    );

    const reordered = arrayMove(locations, oldIndex, newIndex);

    onChange(reordered);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={locations.map((location) => location._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {locations.map((location) => (
            <LocationSortableItem key={location._id} location={location} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
