"use client";

import { CalendarDays, Filter, Moon, Sun, UserCheck } from "lucide-react";

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

export default function ViewAttendanceFilters({
  filters,
  setFilters,
}: AttendanceFiltersProps) {
  const hasFilters = filters.status || filters.shift || filters.date;

  const clearFilters = () => {
    setFilters({
      date: getTodayDate(),
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-linear-to-r from-blue-50 to-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Filter className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Attendance Filters
              </h3>

              <p className="text-xs text-slate-500">
                Refine attendance records by status, shift, or date.
              </p>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Status */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Shift */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Shifts</option>
              <option value="day">☀️ Day Shift</option>
              <option value="night">🌙 Night Shift</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {filters.status && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                Status: {filters.status}
              </span>
            )}

            {filters.shift && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                Shift: {filters.shift}
              </span>
            )}

            {filters.date && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Date: {filters.date}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
