"use client";

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

  onClearSelection: () => void;

  onSubmit: () => void;
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
  onClearSelection,
  onSubmit,
}: AttendanceFiltersProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_auto] items-end">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <input
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 text-sm"
        />

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={query}
            placeholder="Search employees..."
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value as "all" | "present" | "absent" | "leave",
              )
            }
            className="w-full min-w-[120px] rounded-lg border px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          onClick={onBulkPresent}
          disabled={selectedCount === 0}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Bulk Present
        </button>

        <button
          onClick={onClearSelection}
          disabled={selectedCount === 0}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Clear Selection
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Mark Attendance"}
        </button>
      </div>
    </div>
  );
}
