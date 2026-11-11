"use client";

import { MapPin } from "lucide-react";

import { useAreas } from "@/hooks/area/useArea";
import AreaActions from "@/components/area/AreaActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import type { Area } from "@/types/area";

export default function AreaList() {
  const { data, isPending, isError, error, refetch } = useAreas();

  const areas: Area[] = Array.isArray(data) ? data : [];

  if (isPending) {
    return <LoadingState title="Loading areas..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title={error instanceof Error ? error.message : "Failed to load areas."}
        action={
          <Button variant="danger" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (areas.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No areas found"
        description="Add your first area to get started."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader
        className="items-center"
        title="Areas"
        description="Manage your operational areas"
        icon={MapPin}
        actions={<Badge tone="info">{areas.length} total</Badge>}
      />

      {/* Area list */}
      <div className="divide-y divide-slate-100">
        {areas.map((area: Area) => (
          <div
            key={area._id}
            className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          >
            {/* Area details */}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-slate-900">
                {area.name}
              </h3>

              <p className="mt-0.5 text-sm text-slate-500">
                {area.description || "No description provided"}
              </p>
            </div>

            {/* Status and actions */}
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Badge tone={area.isActive ? "success" : "neutral"} dot>
                {area.isActive ? "Active" : "Inactive"}
              </Badge>
              <AreaActions area={area} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
