"use client";

import {
  Search,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Filter,
} from "lucide-react";

import { sectorOptions } from "@/constants/location";
import { LocationSector } from "@/types/location";

interface LocationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  sector?: LocationSector;
  onSectorChange: (value?: LocationSector) => void;

  isActive?: boolean;
  onStatusChange: (value?: boolean) => void;
  onClearFilters?: () => void;

  isFetching: boolean;
  disabled?: boolean;

  totalLocations: number;
  activeLocations: number;
  inactiveLocations: number;
}

export default function LocationFilters({
  search,
  onSearchChange,

  sector,
  onSectorChange,

  isActive,
  onStatusChange,
  onClearFilters = () => {},

  isFetching,
  disabled = false,

  totalLocations,
  activeLocations,
  inactiveLocations,
}: LocationFiltersProps) {
  const hasFilters =
    search.trim() !== "" || sector !== undefined || isActive !== undefined;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-100 bg-linear-to-r from-slate-50 via-white to-blue-50 px-6 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <Filter size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Location Filters
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search and filter locations by sector or status.
                </p>
              </div>
            </div>
          </div>

          {/* Searching */}

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm">
            {isFetching ? (
              <>
                <Loader2 size={16} className="animate-spin text-blue-600" />

                <span className="font-medium text-blue-600">Searching...</span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <span className="text-slate-600">Up to date</span>
              </>
            )}
          </div>
        </div>

        {/* ================= SUMMARY ================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalLocations}
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <MapPin size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-700">
                  Active
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {activeLocations}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-red-600">
                  Inactive
                </p>

                <p className="mt-1 text-2xl font-bold text-red-600">
                  {inactiveLocations}
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <XCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* SEARCH */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Search
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                disabled={disabled}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by location name..."
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  outline-none
                  transition-all
                  duration-200
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          {/* SECTOR */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sector
            </label>

            <select
              value={sector ?? ""}
              disabled={disabled}
              onChange={(e) =>
                onSectorChange(
                  e.target.value
                    ? (e.target.value as LocationSector)
                    : undefined,
                )
              }
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                outline-none
                transition-all
                duration-200
                hover:border-slate-300
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option value="">All Sectors</option>

              {sectorOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

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
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                text-sm
                outline-none
                transition-all
                duration-200
                hover:border-slate-300
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ================= ACTIVE FILTERS ================= */}

        {(hasFilters || disabled) && (
          <div className="mt-6 space-y-4">
            {/* Reorder Banner */}

            {disabled && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />

                <div>
                  <p className="font-medium text-amber-800">Reordering Mode</p>

                  <p className="mt-1 text-sm text-amber-700">
                    Finish reordering or cancel before changing filters.
                  </p>
                </div>
              </div>
            )}

            {/* Active Filters */}

            {hasFilters && (
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">
                    Active Filters
                  </span>

                  {search && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Search: {search}
                    </span>
                  )}

                  {sector && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                      {
                        sectorOptions.find((item) => item.value === sector)
                          ?.label
                      }
                    </span>
                  )}

                  {isActive !== undefined && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={onClearFilters}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    transition-all
                    duration-200
                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-600
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
