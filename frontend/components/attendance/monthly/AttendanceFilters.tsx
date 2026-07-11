"use client";

interface MonthlyAttendanceFiltersProps {
  month: string;
  onMonthChange: (month: string) => void;
  onExport: () => void | Promise<void>;
  isExporting?: boolean;
}

export default function MonthlyAttendanceFilters({
  month,
  onMonthChange,
  onExport,
  isExporting = false,
}: MonthlyAttendanceFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* ========================= */}
        {/* LEFT */}
        {/* ========================= */}

        <div>
          <h2 className="text-lg font-semibold">Monthly Attendance Report</h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a month to view attendance.
          </p>
        </div>

        {/* ========================= */}
        {/* RIGHT */}
        {/* ========================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label
              htmlFor="month"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Month
            </label>

            <input
              id="month"
              type="month"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isExporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>
    </div>
  );
}
