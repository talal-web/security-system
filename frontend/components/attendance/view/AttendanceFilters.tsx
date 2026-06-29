"use client";

import type {
  AttendanceFilters,
  AttendanceShift,
  AttendanceStatus,
} from "@/types/attendance";

interface AttendanceFiltersProps {
  filters: AttendanceFilters;
  setFilters: React.Dispatch<React.SetStateAction<AttendanceFilters>>;
}

export default function ViewAttendanceFilters({
  filters,
  setFilters,
}: AttendanceFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Status */}
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: (e.target.value as AttendanceStatus) || undefined,
            }))
          }
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>

        {/* Shift */}
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={filters.shift ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              shift: (e.target.value as AttendanceShift) || undefined,
            }))
          }
        >
          <option value="">All Shifts</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>

        {/* Date */}
        <input
          type="date"
          className="rounded-lg border px-3 py-2 text-sm"
          value={filters.date ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              date: e.target.value || undefined,
            }))
          }
        />
      </div>
    </div>
  );
}
