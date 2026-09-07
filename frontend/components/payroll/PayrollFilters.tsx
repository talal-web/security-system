"use client";

import { CalendarDays, Search, ShieldCheck, X } from "lucide-react";

import type { PayrollFilters as PayrollFilterValues } from "@/types/payroll";

interface PayrollFiltersProps {
  filters: PayrollFilterValues;
  onChange: (filters: PayrollFilterValues) => void;
}

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const defaultFilters: PayrollFilterValues = {
  year: currentYear,
  month: currentMonth,
  status: "all",
  search: "",
};

export default function PayrollFilters({
  filters,
  onChange,
}: PayrollFiltersProps) {
  const hasChangedFromDefault =
    filters.year !== defaultFilters.year ||
    filters.month !== defaultFilters.month ||
    (filters.status ?? "all") !== "all" ||
    Boolean(filters.search?.trim());

  const updateNumber = (key: "year" | "month", value: string) => {
    onChange({
      ...filters,
      [key]: value ? Number(value) : undefined,
    });
  };

  const updateSearch = (value: string) => {
    onChange({
      ...filters,
      search: value,
    });
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10";

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Filters</h2>

        {hasChangedFromDefault && (
          <button
            type="button"
            onClick={() => onChange(defaultFilters)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-800"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <label className="relative lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search name or employee ID"
            aria-label="Search employee"
            className={`${inputClass} pl-9`}
          />
        </label>

        {/* Year */}
        <label className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <select
            aria-label="Payroll year"
            value={filters.year ?? ""}
            onChange={(event) => updateNumber("year", event.target.value)}
            className={`${inputClass} pl-9`}
          >
            <option value="">All years</option>

            {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {/* Month */}
        <label className="relative">
          <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <select
            aria-label="Payroll month"
            value={filters.month ?? ""}
            onChange={(event) => updateNumber("month", event.target.value)}
            className={`${inputClass} pl-9`}
          >
            <option value="">All months</option>

            {Array.from({ length: 12 }, (_, index) => {
              const month = index + 1;

              return (
                <option key={month} value={month}>
                  {new Date(2000, index, 1).toLocaleString("en", {
                    month: "long",
                  })}
                </option>
              );
            })}
          </select>
        </label>

        {/* Status */}
        <label className="relative">
          <ShieldCheck className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <select
            aria-label="Payroll status"
            value={filters.status ?? "all"}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as PayrollFilterValues["status"],
              })
            }
            className={`${inputClass} pl-9`}
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      </div>
    </section>
  );
}
