"use client";

import { CalendarDays, Filter, RotateCcw, Sun, UserCheck } from "lucide-react";

import type {
  AttendanceFilters,
  AttendanceShift,
  AttendanceStatus,
} from "@/types/attendance";

import { getTodayDate } from "@/utils/attendance/date";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600";

const controlClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

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
    <Card>
      <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex h-9 shrink-0 items-center gap-2 text-slate-700">
          <div className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            <Filter className="size-4" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Filters
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Status */}
          <div>
            <label className={labelClass}>
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
              className={controlClass}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Shift */}
          <div>
            <label className={labelClass}>
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
              className={controlClass}
            >
              <option value="">All Shifts</option>
              <option value="day">Day Shift</option>
              <option value="night">Night Shift</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>
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
              className={controlClass}
            />
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <RotateCcw />
            Reset
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
