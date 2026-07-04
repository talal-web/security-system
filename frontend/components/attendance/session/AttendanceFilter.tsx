"use client";

import {
  Calendar,
  CheckCircle2,
  RotateCcw,
  Search,
  Send,
  Users,
  XCircle,
} from "lucide-react";

interface AttendanceFiltersProps {
  dateValue: string;

  query: string;

  statusFilter: "all" | "present" | "absent" | "leave";

  selectedCount: number;

  isSubmitting: boolean;

  onDateChange: (value: string) => void;

  onQueryChange: (value: string) => void;

  onStatusFilterChange: (value: "all" | "present" | "absent" | "leave") => void;

  onBulkPresent: () => void;

  onBulkAbsent: () => void;

  onBulkLeave: () => void;

  onClearSelection: () => void;

  onSubmit: () => void;
  onReview?: () => void;
}

export default function AttendanceFilters({
  dateValue,
  query,
  statusFilter,
  selectedCount,
  isSubmitting,

  onDateChange,
  onQueryChange,
  onStatusFilterChange,

  onBulkPresent,
  onBulkAbsent,
  onBulkLeave,

  onClearSelection,
  onSubmit,
  onReview,
}: AttendanceFiltersProps) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance Controls
          </h2>

          <p className="text-sm text-slate-500">
            Search employees, filter attendance and perform bulk actions.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2">
          <Users className="h-5 w-5 text-blue-600" />

          <span className="text-sm font-semibold text-blue-700">
            {selectedCount} Selected
          </span>
        </div>
      </div>

      {/* ================= FILTERS ================= */}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Date */}

        <div className="relative">
          <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <input
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status */}

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

      {/* ================= BULK ACTIONS ================= */}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onBulkPresent}
          disabled={!selectedCount}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark Present
        </button>

        <button
          type="button"
          onClick={onBulkAbsent}
          disabled={!selectedCount}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
          Mark Absent
        </button>

        <button
          type="button"
          onClick={onBulkLeave}
          disabled={!selectedCount}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Leave
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          disabled={!selectedCount}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>

        <div className="ml-auto">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReview}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Review
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />

              {isSubmitting ? "Saving..." : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
