"use client";

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
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* DATE */}
        <div className="w-full md:w-auto">
          <label
            htmlFor="attendance-date"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={filters.date ?? ""}
            onChange={(e) => handleChange("date", e.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-40"
          />
        </div>

        {/* STATUS */}
        <div className="w-full md:w-auto">
          <label
            htmlFor="attendance-status"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Status
          </label>

          <select
            id="attendance-status"
            value={filters.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-33.75"
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
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Shift
          </label>

          <select
            id="attendance-shift"
            value={filters.shift ?? ""}
            onChange={(e) => handleChange("shift", e.target.value)}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-33.75"
          >
            <option value="">All Shifts</option>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
        </div>

        {/* RESET */}
        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
