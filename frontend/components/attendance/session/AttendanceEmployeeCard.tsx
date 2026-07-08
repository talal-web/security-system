"use client";

import {
  CalendarClock,
  CheckCircle2,
  MapPin,
  Moon,
  Sun,
  XCircle,
} from "lucide-react";

import type { AttendanceFormEmployee } from "@/types/attendance-session";

interface AttendanceEmployeeCardProps {
  employee: AttendanceFormEmployee;
  locations: {
    _id: string;
    name: string;
    sortOrder: number;
  }[];
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
  },
  {
    value: "absent",
    label: "Absent",
    icon: XCircle,
  },
  {
    value: "leave",
    label: "Leave",
    icon: CalendarClock,
  },
] as const;

const shiftOptions = [
  {
    value: "day",
    label: "Day",
    icon: Sun,
  },
  {
    value: "night",
    label: "Night",
    icon: Moon,
  },
] as const;

export default function AttendanceEmployeeCard({
  employee,
  locations,
  onUpdate,
}: AttendanceEmployeeCardProps) {
  const isPresent = employee.status === "present";

  const isInactiveLocation =
    employee.currentLocation && !employee.currentLocation.isActive;

  const initials = employee.name
    .split(" ")
    .map((word) => word[0])
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
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {employee.name}
              </h3>

              <p className="truncate text-xs text-slate-500">
                S/O {employee.fatherName}
              </p>
            </div>

            <span className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              {employee.designation}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isInactiveLocation
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <MapPin className="h-3 w-3" />
              {employee.currentLocation?.name ?? "No Location"}
            </span>

            {isInactiveLocation && (
              <span className="text-[10px] font-medium text-red-600">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <select
          value={employee.status}
          onChange={(e) =>
            onUpdate(employee.employeeId, "status", e.target.value)
          }
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={employee.shift ?? ""}
          disabled={!isPresent}
          onChange={(e) =>
            onUpdate(employee.employeeId, "shift", e.target.value)
          }
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="" disabled>
            Shift
          </option>
          {shiftOptions.map((shift) => (
            <option key={shift.value} value={shift.value}>
              {shift.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <select
          value={employee.selectedLocation ?? ""}
          disabled={!isPresent}
          onChange={(e) =>
            onUpdate(
              employee.employeeId,
              "selectedLocation",
              e.target.value || null,
            )
          }
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="">Location</option>

          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={employee.remarks}
          onChange={(e) =>
            onUpdate(employee.employeeId, "remarks", e.target.value)
          }
          placeholder="Remark..."
          className="h-9 rounded-lg border border-slate-300 px-2 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {!isPresent && (
        <div
          className={`mt-2 rounded-lg border px-3 py-2 text-[11px] font-medium ${
            employee.status === "absent"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {employee.status === "absent"
            ? "Employee marked as Absent."
            : "Employee is on Leave."}
        </div>
      )}

      {isPresent && isInactiveLocation && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700">
          Current location is inactive.
        </div>
      )}
    </div>
  );
}
