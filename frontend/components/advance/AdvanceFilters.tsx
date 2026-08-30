"use client";

import { CalendarDays, Search, ShieldCheck, X } from "lucide-react";

import { getDefaultFromDate } from "@/utils/date/getDefaultFilerDate";

import type {
  AdvanceFilters as AdvanceFilterValues,
  AdvanceStatus,
} from "@/types/advance";

interface AdvanceFiltersProps {
  filters: AdvanceFilterValues;
  onChange: (filters: AdvanceFilterValues) => void;
}

export default function AdvanceFilters({
  filters,
  onChange,
}: AdvanceFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean);

  const defaultFromDate = filters.fromDate ?? getDefaultFromDate();

  const updateFilter = (key: keyof AdvanceFilterValues, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onChange({
      fromDate: getDefaultFromDate(),
    });
  };

  const inputClass =
    "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-[11px] text-slate-700 shadow-sm outline-none transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/10 sm:h-10 sm:rounded-xl sm:pl-10 sm:pr-4 sm:text-sm";

  const iconClass =
    "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors sm:left-3 sm:h-4 sm:w-4";

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-slate-800 sm:text-base">
            Filters
          </h2>

          {hasFilters && (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-orange-600 ring-1 ring-inset ring-orange-500/10 sm:text-[10px]">
              Active
            </span>
          )}
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-medium text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-95 sm:h-auto sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 xl:grid-cols-4">
        {/* Search */}
        <div className="relative col-span-2">
          <Search className={iconClass} />

          <input
            type="text"
            placeholder="Search employee ID or name..."
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            className={inputClass}
          />

          {filters.search && (
            <button
              type="button"
              onClick={() => updateFilter("search", "")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="relative">
          <ShieldCheck className={iconClass} />

          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              updateFilter("status", event.target.value as AdvanceStatus)
            }
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
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
            value={filters.toDate ?? ""}
            onChange={(event) => updateFilter("toDate", event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
