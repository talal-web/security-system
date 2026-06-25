"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { EmployeeFilters } from "@/types/employee-filters";

import { Filter, Plus, Search } from "lucide-react";

type Props = {
  filters: EmployeeFilters;

  setFilters: Dispatch<SetStateAction<EmployeeFilters>>;

  activeFilterCount: number;

  onToggleFilters: () => void;
};

export default function EmployeeToolbar({
  filters,
  setFilters,
  activeFilterCount,
  onToggleFilters,
}: Props) {
  return (
    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search employee..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <Link
            href="/employees/create"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>
      </div>
    </div>
  );
}
