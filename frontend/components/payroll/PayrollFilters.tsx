"use client";

import { CalendarDays, Search, ShieldCheck, UserCheck, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  employeeStatus: "active",
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
    (filters.employeeStatus ?? "active") !== defaultFilters.employeeStatus ||
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
    "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card transition focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";
  const iconClass =
    "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400";

  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-3 flex min-h-8 items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>

        {hasChangedFromDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultFilters)}
          >
            <X />
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <label className="relative lg:col-span-1">
          <Search className={iconClass} />

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
          <CalendarDays className={iconClass} />

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
          <CalendarDays className={iconClass} />

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
          <ShieldCheck className={iconClass} />

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

        {/* Employee Status */}
        <label className="relative">
          <UserCheck className={iconClass} />

          <select
            aria-label="Employee status"
            value={filters.employeeStatus ?? "all"}
            onChange={(event) =>
              onChange({
                ...filters,
                employeeStatus: event.target
                  .value as PayrollFilterValues["employeeStatus"],
              })
            }
            className={`${inputClass} pl-9`}
          >
            <option value="all">All employees</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>
    </Card>
  );
}
