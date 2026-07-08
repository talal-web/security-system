"use client";

import { Calendar, Search, Send } from "lucide-react";

interface AttendanceFiltersProps {
  dateValue: string;
  query: string;
  statusFilter: "all" | "present" | "absent" | "leave";
  isSubmitting: boolean;
  onDateChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "present" | "absent" | "leave") => void;
  onSubmit: () => void;
}

export default function AttendanceFilters({
  dateValue,
  query,
  statusFilter,
  isSubmitting,
  onDateChange,
  onQueryChange,
  onStatusFilterChange,
  onSubmit,
}: AttendanceFiltersProps) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance Controls
          </h2>

          <p className="text-sm text-slate-500">
            Search employees, filter attendance, and update each person
            directly.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <input
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(
              e.target.value as "all" | "present" | "absent" | "leave",
            )
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All Employees</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
}
