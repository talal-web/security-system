"use client";

import { CalendarDays, Search, ShieldCheck, X } from "lucide-react";

import {
  getDefaultFromDate,
  getTodayDate,
} from "@/utils/date/getDefaultFilerDate";

import type { FineFilters as FineFilterValues, FineStatus } from "@/types/fine";

interface FineFiltersProps {
  filters: FineFilterValues;
  onChange: (filters: FineFilterValues) => void;
}

export default function FineFilters({ filters, onChange }: FineFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean);

  const updateFilter = (key: keyof FineFilterValues, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleClear = () => {
    onChange({
      fromDate: getDefaultFromDate(),
      toDate: getTodayDate(),
    });
  };

  const inputClass =
    "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10";

  const iconClass =
    "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Filters</h2>

        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className={iconClass} />

          <input
            type="search"
            placeholder="Search employee ID or name..."
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            className={inputClass}
          />
        </div>

        {/* Status */}
        <div className="relative">
          <ShieldCheck className={iconClass} />

          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              updateFilter("status", event.target.value as FineStatus)
            }
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partially_deducted">Partially Deducted</option>
            <option value="fully_deducted">Fully Deducted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* From Date */}
        <div className="relative">
          <CalendarDays className={iconClass} />

          <input
            type="date"
            aria-label="From date"
            value={filters.fromDate ?? ""}
            onChange={(event) => updateFilter("fromDate", event.target.value)}
            className={inputClass}
          />
        </div>

        {/* To Date */}
        <div className="relative">
          <CalendarDays className={iconClass} />

          <input
            type="date"
            aria-label="To date"
            value={filters.toDate ?? ""}
            onChange={(event) => updateFilter("toDate", event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
