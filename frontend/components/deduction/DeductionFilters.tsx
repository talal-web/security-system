"use client";

import {
  CalendarDays,
  ChevronDown,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  getDefaultFromDate,
  getTodayDate,
} from "@/utils/date/getDefaultFilerDate";

import type {
  DeductionFilters as DeductionFilterValues,
  DeductionStatus,
} from "@/types/deduction";

interface DeductionFiltersProps {
  filters: DeductionFilterValues;
  onChange: (filters: DeductionFilterValues) => void;
}

const inputClass =
  "h-9 w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-card transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

const iconClass =
  "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400";

export default function DeductionFilters({
  filters,
  onChange,
}: DeductionFiltersProps) {
  // ============================================================
  // Filter State
  // ============================================================

  const defaultFromDate = filters.fromDate ?? getDefaultFromDate();
  const defaultToDate = filters.toDate ?? getTodayDate();

  const hasFilters =
    Boolean(filters.search?.trim()) ||
    Boolean(filters.status) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate);

  // ============================================================
  // Update Filter
  // ============================================================

  const updateFilter = (key: keyof DeductionFilterValues, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  // ============================================================
  // Clear Filters
  // ============================================================

  const clearFilters = () => {
    onChange({
      fromDate: getDefaultFromDate(),
      toDate: getTodayDate(),
    });
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <Card>
      <CardHeader className="items-center py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
          {hasFilters && <Badge tone="info">Active</Badge>}
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X />
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {/* Search */}
          <div className="relative sm:col-span-3 xl:col-span-2">
            <Search className={iconClass} />

            <input
              type="text"
              placeholder="Search employee ID or name..."
              value={filters.search ?? ""}
              onChange={(event) => updateFilter("search", event.target.value)}
              className={`${inputClass} pr-9`}
            />

            {filters.search && (
              <button
                type="button"
                onClick={() => updateFilter("search", "")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Status */}
          <div className="relative">
            <ShieldCheck className={iconClass} />

            <select
              value={filters.status ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onChange({
                  ...filters,
                  status: value ? (value as DeductionStatus) : undefined,
                });
              }}
              className={`${inputClass} cursor-pointer pr-9`}
            >
              <option value="">All Status</option>

              <option value="pending">Pending</option>

              <option value="partially_deducted">Partially Deducted</option>

              <option value="fully_deducted">Fully Deducted</option>

              <option value="cancelled">Cancelled</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* From Date */}
          <div className="relative">
            <CalendarDays className={iconClass} />

            <input
              type="date"
              value={defaultFromDate}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
              className={inputClass}
            />
          </div>

          {/* To Date */}
          <div className="relative">
            <CalendarDays className={iconClass} />

            <input
              type="date"
              value={defaultToDate}
              min={defaultFromDate}
              onChange={(event) => updateFilter("toDate", event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
