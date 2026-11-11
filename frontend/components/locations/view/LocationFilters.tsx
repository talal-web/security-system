"use client";

import {
  Search,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
  Plus,
  FileSpreadsheet,
} from "lucide-react";

import AreaSelect from "@/components/area/AreaSelect";
import SectorFilterSelect from "@/components/sectors/SectorFilterSelect";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

interface LocationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  area?: string;
  selectedAreaLabel?: string;
  onAreaChange: (value?: string) => void;

  sector?: string;
  selectedSectorLabel?: string;
  onSectorChange: (value?: string) => void;

  isActive?: boolean;
  onStatusChange: (value?: boolean) => void;
  onClearFilters?: () => void;
  onCreateLocation: () => void;
  onExportLocations: () => void;

  isFetching: boolean;
  disabled?: boolean;

  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
}

const controlClasses =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";

// Wrapper styling for AreaSelect / SectorSelect (they render their own <select>).
const wrapperControlClasses =
  "flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15";

const labelClasses = "mb-1.5 block text-xs font-medium text-slate-600";

export default function LocationFilters({
  search,
  onSearchChange,

  area,
  selectedAreaLabel,
  onAreaChange,

  sector,
  selectedSectorLabel,
  onSectorChange,

  isActive,
  onStatusChange,
  onClearFilters = () => {},
  onCreateLocation,
  onExportLocations,

  isFetching,
  disabled = false,

  totalLocations,
  activeLocations,
  inactiveLocations,
}: LocationFiltersProps) {
  const hasFilters =
    search.trim() !== "" ||
    sector !== undefined ||
    isActive !== undefined;

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <PageHeader
        title="Locations"
        description="Search locations in the selected area by sector or status."
        icon={MapPin}
        actions={
          <>
            <span className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium shadow-card">
              {isFetching ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-blue-600" />
                  <span className="text-blue-600">Searching...</span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Up to date</span>
                </>
              )}
            </span>

            <Button
              variant="secondary"
              onClick={onExportLocations}
              disabled={disabled || totalLocations === 0}
            >
              <FileSpreadsheet className="text-emerald-600" />
              Export Excel
            </Button>

            <Button onClick={onCreateLocation}>
              <Plus />
              Add Location
            </Button>
          </>
        }
      />

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total"
          value={totalLocations}
          icon={MapPin}
          tone="blue"
        />
        <StatCard
          label="Active"
          value={activeLocations}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Inactive"
          value={inactiveLocations}
          icon={XCircle}
          tone="red"
        />
      </div>

      {/* ================= FILTERS ================= */}

      <Card>
        <CardHeader
          title="Location Filters"
          description="Filter by search, area, sector or status."
          icon={Filter}
        />

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* SEARCH */}

            <div>
              <label className={labelClasses}>Search</label>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  disabled={disabled}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by location name..."
                  className={`${controlClasses} pl-9`}
                />
              </div>
            </div>

            {/* AREA */}

            <div>
              <label className={labelClasses}>Area</label>

              <AreaSelect
                showLabel={false}
                value={area ?? ""}
                useGlobalSelection
                disabled={disabled}
                onChange={(event) =>
                  onAreaChange(event.target.value || undefined)
                }
                wrapperClassName={wrapperControlClasses}
              />
            </div>

            {/* SECTOR */}

            <div>
              <label className={labelClasses}>Sector</label>

              <SectorFilterSelect
                value={sector}
                areaId={area}
                disabled={disabled}
                onChange={onSectorChange}
                className={wrapperControlClasses}
              />
            </div>

            {/* STATUS */}

            <div>
              <label className={labelClasses}>Status</label>

              <select
                value={
                  isActive === undefined ? "" : isActive ? "active" : "inactive"
                }
                disabled={disabled}
                onChange={(e) =>
                  onStatusChange(
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "active",
                  )
                }
                className={controlClasses}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ================= ACTIVE FILTERS ================= */}

          {(hasFilters || disabled || area) && (
            <div className="mt-5 space-y-4">
              {/* Reorder Banner */}

              {disabled && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500" />

                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Reordering Mode
                    </p>

                    <p className="mt-0.5 text-sm text-amber-700">
                      Finish reordering or cancel before changing filters.
                    </p>
                  </div>
                </div>
              )}

              {/* Active Filters */}

              {hasFilters && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Active Filters
                    </span>

                    {search && (
                      <Badge tone="info" className="max-w-full truncate">
                        Search: {search}
                      </Badge>
                    )}

                    {area && (
                      <Badge tone="neutral">
                        {selectedAreaLabel ?? "Selected area"}
                      </Badge>
                    )}

                    {sector && (
                      <Badge tone="neutral">
                        {selectedSectorLabel ?? "Selected sector"}
                      </Badge>
                    )}

                    {isActive !== undefined && (
                      <Badge tone={isActive ? "success" : "danger"} dot>
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </div>

                  {hasFilters && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={disabled}
                      onClick={onClearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
