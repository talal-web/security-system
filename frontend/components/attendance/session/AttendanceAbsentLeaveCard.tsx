"use client";

import { CalendarClock, CheckCircle2, XCircle } from "lucide-react";

import type { AttendanceFormEmployee } from "@/types/attendance-session";

interface AttendanceAbsentLeaveCardProps {
  employee: AttendanceFormEmployee;

  selected: boolean;

  onSelect: (checked: boolean) => void;

  onUpdate: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
}

const statusOptions = [
  {
    value: "present",
    label: "Present",
  },
  {
    value: "absent",
    label: "Absent",
  },
  {
    value: "leave",
    label: "Leave",
  },
] as const;

export default function AttendanceAbsentLeaveCard({
  employee,
  selected,
  onSelect,
  onUpdate,
}: AttendanceAbsentLeaveCardProps) {
  const initials = employee.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const borderColor =
    employee.status === "present"
      ? "border-green-400"
      : employee.status === "absent"
        ? "border-red-400"
        : "border-amber-400";

  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${borderColor}`}
    >
      {/* ================= Header ================= */}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {employee.name}
              </h3>

              <p className="truncate text-xs text-slate-500">
                {employee.designation}
              </p>
            </div>

            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {employee.empId}
            </span>
          </div>
        </div>
      </div>

      {/* ================= Status ================= */}

      <div className="mt-3">
        <select
          value={employee.status}
          onChange={(e) =>
            onUpdate(employee.employeeId, "status", e.target.value)
          }
          className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================= Remark ================= */}

      <div className="mt-2">
        <input
          type="text"
          value={employee.remarks}
          onChange={(e) =>
            onUpdate(employee.employeeId, "remarks", e.target.value)
          }
          placeholder="Remark..."
          className="h-9 w-full rounded-lg border border-slate-300 px-2 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* ================= Info ================= */}

      <div
        className={`mt-2 rounded-lg border px-3 py-2 text-[11px] font-medium ${
          employee.status === "absent"
            ? "border-red-200 bg-red-50 text-red-700"
            : employee.status === "leave"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-green-200 bg-green-50 text-green-700"
        }`}
      >
        {employee.status === "present"
          ? "Employee is now marked as Present."
          : employee.status === "absent"
            ? "Employee marked as Absent."
            : "Employee is on Leave."}
      </div>
    </div>
  );
}
