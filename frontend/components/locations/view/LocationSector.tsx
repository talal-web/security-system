"use client";

import { ArrowUpDown, Building2, Check, X } from "lucide-react";

import type { ILocation, LocationSectorId } from "@/types/location";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

import LocationCard from "./LocationCard";
import LocationSortableList from "../reorder/LocationSortableList";

interface LocationSectorProps {
  sectorId: string;
  sectorLabel: string;
  items: ILocation[];

  reorderSector: LocationSectorId | null;
  reorderItems: ILocation[];

  setReorderSector: (sector: LocationSectorId | null) => void;
  setReorderItems: React.Dispatch<React.SetStateAction<ILocation[]>>;

  handleSaveOrder: () => void;
  isSavingOrder: boolean;

  onEdit: (id: string) => void;
}

export default function LocationSector({
  sectorId,
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
  const isReordering = reorderSector === sectorId;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader
        className="items-center"
        actions={
          isReordering ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                disabled={isSavingOrder}
                onClick={() => setReorderSector(null)}
              >
                <X />
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={isSavingOrder}
                onClick={handleSaveOrder}
              >
                <Check />
                {isSavingOrder ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={items.length <= 1}
              onClick={() => {
                setReorderSector(sectorId);

                setReorderItems(
                  [...items].sort((a, b) => a.sortOrder - b.sortOrder),
                );
              }}
            >
              <ArrowUpDown />
              Reorder
            </Button>
          )
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            <Building2 className="size-4" />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-900">
              {sectorLabel}
            </h2>

            <Badge tone="neutral">{items.length}</Badge>
          </div>
        </div>
      </CardHeader>

      {isReordering ? (
        <div className="bg-slate-50/50 p-4 sm:p-5">
          <LocationSortableList
            locations={reorderItems}
            onChange={setReorderItems}
          />
        </div>
      ) : (
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((location) => (
            <LocationCard
              key={location._id}
              location={location}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
