"use client";

import { CalendarDays, Filter, RotateCcw, Sun, UserCheck } from "lucide-react";

import type {
  AttendanceFilters,
  AttendanceShift,
  AttendanceStatus,
} from "@/types/attendance";

import { getTodayDate } from "@/utils/attendance/date";

interface AttendanceFiltersProps {
  filters: AttendanceFilters;
  setFilters: React.Dispatch<React.SetStateAction<AttendanceFilters>>;
}

export default function AttendanceFilters({
  filters,
  setFilters,
}: AttendanceFiltersProps) {
  const today = getTodayDate();

  const hasFilters =
    Boolean(filters.status) ||
    Boolean(filters.shift) ||
    Boolean(filters.date && filters.date !== today);

  const clearFilters = () => {
    setFilters({
      date: today,
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex h-9 shrink-0 items-center gap-2 text-slate-700">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <Filter className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide">
            Filters
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
          {/* Status */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <UserCheck className="h-3.5 w-3.5" />
              Status
            </label>

            <select
              value={filters.status ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: (e.target.value as AttendanceStatus) || undefined,
                }))
              }
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Shift */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <Sun className="h-3.5 w-3.5" />
              Shift
            </label>

            <select
              value={filters.shift ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  shift: (e.target.value as AttendanceShift) || undefined,
                }))
              }
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Shifts</option>
              <option value="day">Day Shift</option>
              <option value="night">Night Shift</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              Date
            </label>

            <input
              type="date"
              value={filters.date ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  date: e.target.value || undefined,
                }))
              }
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
