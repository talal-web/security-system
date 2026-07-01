"use client";

import { useState } from "react";
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
    icon: CheckCircle2,
    active: "border-green-600 bg-green-600 text-white",
    inactive:
      "border-slate-300 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50",
  },
  {
    value: "absent",
    label: "Absent",
    icon: XCircle,
    active: "border-red-600 bg-red-600 text-white",
    inactive:
      "border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50",
  },
  {
    value: "leave",
    label: "Leave",
    icon: CalendarClock,
    active: "border-amber-500 bg-amber-500 text-white",
    inactive:
      "border-slate-300 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
  },
] as const;

export default function AttendanceAbsentLeaveCard({
  employee,
  selected,
  onSelect,
  onUpdate,
}: AttendanceAbsentLeaveCardProps) {
  const [showRemarks, setShowRemarks] = useState(
    Boolean(employee.remarks.trim()),
  );

  const initials = employee.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const border =
    employee.status === "absent"
      ? "border-red-500"
      : employee.status === "leave"
        ? "border-amber-400"
        : "border-green-500";

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${border}`}
    >
      {/* Header */}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-2 h-4 w-4 rounded border-slate-300"
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">
              {employee.name}
            </h3>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {employee.empId}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">{employee.designation}</p>

          <p className="mt-1 text-xs text-slate-400">{employee.fatherName}</p>
        </div>
      </div>

      {/* Status */}

      <div className="mt-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Attendance Status
        </p>

        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((status) => {
            const Icon = status.icon;

            const active = employee.status === status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  onUpdate(employee.employeeId, "status", status.value)
                }
                className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  active ? status.active : status.inactive
                }`}
              >
                <Icon className="h-4 w-4" />
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Information */}

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-medium text-amber-800">
          This employee has no duty assignment.
        </p>

        <p className="mt-1 text-xs text-amber-700">
          Shift and location are assigned automatically if the status changes to
          <span className="font-semibold"> Present</span>.
        </p>
      </div>

      {/* Remarks */}

      <div className="mt-5 border-t border-slate-100 pt-4">
        {!showRemarks ? (
          <button
            type="button"
            onClick={() => setShowRemarks(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + Add Remark
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Remark
              </label>

              {employee.remarks.trim() === "" && (
                <button
                  type="button"
                  onClick={() => setShowRemarks(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Hide
                </button>
              )}
            </div>

            <input
              type="text"
              value={employee.remarks}
              onChange={(e) =>
                onUpdate(employee.employeeId, "remarks", e.target.value)
              }
              placeholder="Optional remark..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}
