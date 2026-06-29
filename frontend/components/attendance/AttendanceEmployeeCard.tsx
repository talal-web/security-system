"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  MapPin,
  Moon,
  Sun,
  XCircle,
} from "lucide-react";

import { AttendanceFormEmployee } from "@/types/attendance-session";

interface AttendanceEmployeeCardProps {
  employee: AttendanceFormEmployee;
  locations: {
    _id: string;
    name: string;
  }[];

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
    activeClass: "border-green-600 bg-green-600 text-white",
    inactiveClass:
      "border-slate-300 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50",
  },
  {
    value: "absent",
    label: "Absent",
    icon: XCircle,
    activeClass: "border-red-600 bg-red-600 text-white",
    inactiveClass:
      "border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50",
  },
  {
    value: "leave",
    label: "Leave",
    icon: CalendarClock,
    activeClass: "border-amber-500 bg-amber-500 text-white",
    inactiveClass:
      "border-slate-300 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
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
  selected,
  onSelect,
  onUpdate,
}: AttendanceEmployeeCardProps) {
  const [showRemarks, setShowRemarks] = useState(
    Boolean(employee.remarks?.trim()),
  );

  const isInactiveLocation =
    employee.currentLocation && !employee.currentLocation.isActive;

  const initials = employee.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const borderColor =
    employee.status === "present"
      ? "border-green-500"
      : employee.status === "absent"
        ? "border-red-500"
        : employee.status === "leave"
          ? "border-amber-400"
          : "border-slate-200";

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${borderColor}`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-2 h-4 w-4 shrink-0 rounded border-slate-300"
        />

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {employee.name}
            </h3>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {employee.empId}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-slate-500">
            {employee.designation}
          </p>

          <div
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              isInactiveLocation
                ? "border border-red-200 bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />

            {employee.currentLocation?.name ?? "Not Assigned"}

            {isInactiveLocation && (
              <span className="font-semibold">(Inactive)</span>
            )}
          </div>
        </div>
      </div>
      {/* ================= STATUS ================= */}
      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Attendance
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
                className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-semibold transition-all ${
                  active ? status.activeClass : status.inactiveClass
                }`}
              >
                <Icon className="h-4 w-4" />

                <span>{status.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Shift + Location starts here in Part 2 */} {/* Location */}
      <div
        className={`mb-3 rounded-lg border px-3 py-2 ${
          isInactiveLocation
            ? "border-red-200 bg-red-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`truncate text-[11px] font-medium ${
            isInactiveLocation ? "text-red-700" : "text-slate-600"
          }`}
        >
          📍 {employee.currentLocation?.name ?? "Not Assigned"}
          {isInactiveLocation && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
              Inactive
            </span>
          )}
        </p>
      </div>
      {/* ================= SHIFT + LOCATION ================= */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {/* Shift */}

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Shift
          </p>

          <div className="grid grid-cols-2 gap-2">
            {shiftOptions.map((shift) => {
              const Icon = shift.icon;
              const active = employee.shift === shift.value;

              return (
                <button
                  key={shift.value}
                  type="button"
                  onClick={() =>
                    onUpdate(employee.employeeId, "shift", shift.value)
                  }
                  className={`flex items-center justify-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {shift.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Location
          </label>

          <select
            value={employee.selectedLocation ?? ""}
            onChange={(e) =>
              onUpdate(
                employee.employeeId,
                "selectedLocation",
                e.target.value || null,
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Location</option>

            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ================= REMARKS ================= */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        {!showRemarks ? (
          <button
            type="button"
            onClick={() => setShowRemarks(true)}
            className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
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
                  className="text-[11px] text-slate-400 hover:text-slate-600"
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
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}
