"use client";

import { Button } from "@/components/ui/Button";

import type { AttendanceFilters as AttendanceFilterType } from "@/types/attendance";

interface AttendanceFiltersProps {
  filters: AttendanceFilterType;
  onChange: (filters: AttendanceFilterType) => void;
  onReset?: () => void;
}

export default function AttendanceFilters({
  filters,
  onChange,
  onReset,
}: AttendanceFiltersProps) {
  const handleChange = (field: keyof AttendanceFilterType, value: string) => {
    onChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const hasFilters =
    Boolean(filters.date) || Boolean(filters.status) || Boolean(filters.shift);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* DATE */}
        <div className="w-full md:w-auto">
          <label
            htmlFor="attendance-date"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={filters.date ?? ""}
            onChange={(e) => handleChange("date", e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 md:w-40"
          />
        </div>

        {/* STATUS */}
        <div className="w-full md:w-auto">
          <label
            htmlFor="attendance-status"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Status
          </label>

          <select
            id="attendance-status"
            value={filters.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 md:w-33.75"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>

        {/* SHIFT */}
        <div className="w-full md:w-auto">
          <label
            htmlFor="attendance-shift"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Shift
          </label>

          <select
            id="attendance-shift"
            value={filters.shift ?? ""}
            onChange={(e) => handleChange("shift", e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 md:w-33.75"
          >
            <option value="">All Shifts</option>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
        </div>

        {/* RESET */}
        {hasFilters && onReset && (
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
