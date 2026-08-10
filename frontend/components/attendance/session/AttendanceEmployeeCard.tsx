"use client";

import { useMemo, type ChangeEvent } from "react";
import { Clock3, MapPin, MessageSquare } from "lucide-react";

import type { AttendanceFormEmployee } from "@/types/attendance-session";
import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";

import { shiftOptions } from "@/constants/shiftOptions";

interface AttendanceEmployeeCardProps {
  employee: AttendanceFormEmployee;

  locations: {
    _id: string;
    name: string;
    sortOrder: number;
  }[];

  onUpdate: (
    employeeId: string,
    field: Exclude<keyof AttendanceFormEmployee, "selectedLocation">,
    value: unknown,
  ) => void;

  onLocationChange: (employeeId: string, locationId: string) => void;
}

const statusOptions: Array<{
  value: AttendanceStatus;
  label: string;
}> = [
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
];

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EM"
  );
}

function getStatusStyles(status: AttendanceStatus) {
  switch (status) {
    case "absent":
      return {
        accent: "bg-red-500",
        avatar: "bg-red-50 text-red-700",
        border: "border-red-200",
        select: "border-red-200",
      };

    case "leave":
      return {
        accent: "bg-amber-500",
        avatar: "bg-amber-50 text-amber-700",
        border: "border-amber-200",
        select: "border-amber-200",
      };

    case "present":
    default:
      return {
        accent: "bg-emerald-500",
        avatar: "bg-blue-50 text-blue-700",
        border: "border-slate-200",
        select: "border-slate-300",
      };
  }
}

export default function AttendanceEmployeeCard({
  employee,
  locations,
  onUpdate,
  onLocationChange,
}: AttendanceEmployeeCardProps) {
  const orderedLocations = useMemo(
    () =>
      [...locations].sort((left, right) => left.sortOrder - right.sortOrder),
    [locations],
  );

  const initials = getInitials(employee.name);
  const styles = getStatusStyles(employee.status);
  const isPresent = employee.status === "present";

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onUpdate(
      employee.employeeId,
      "status",
      event.target.value as AttendanceStatus,
    );
  };

  const handleShiftChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    onUpdate(
      employee.employeeId,
      "shift",
      value === "" ? null : (value as AttendanceShift),
    );
  };

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value;

    if (!locationId) {
      return;
    }

    onLocationChange(employee.employeeId, locationId);
  };

  const handleRemarksChange = (event: ChangeEvent<HTMLInputElement>) => {
    onUpdate(employee.employeeId, "remarks", event.target.value);
  };

  return (
    <article
      className={[
        "relative overflow-hidden rounded-lg border bg-white",
        "shadow-sm transition-shadow duration-150",
        "hover:shadow-md",
        styles.border,
      ].join(" ")}
    >
      {/* Status accent */}
      <div className={`absolute inset-y-0 left-0 w-0.5 ${styles.accent}`} />

      <div className="p-3">
        {/* =========================
            EMPLOYEE HEADER
        ========================= */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Avatar */}
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-lg text-xs font-bold",
              styles.avatar,
            ].join(" ")}
          >
            {initials}
          </div>

          {/* Two-column employee information */}
          <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-3">
            {/* LEFT: Name + Father Name */}
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-bold leading-4 text-slate-900">
                {employee.name}
              </h3>

              <p className="mt-0.5 truncate text-[10px] font-medium leading-3.5 text-slate-500">
                {employee.fatherName || "Father name not available"}
              </p>
            </div>

            {/* RIGHT: Employee ID + Designation */}
            <div className="min-w-0 text-right">
              <p className="truncate font-mono text-[10px] font-bold leading-4 text-slate-700">
                {employee.empId}
              </p>

              <p className="mt-0.5 max-w-25 truncate text-[10px] font-medium leading-3.5 text-slate-500">
                {employee.designation || "Employee"}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            LOCATION
        ========================= */}
        <div className="mt-2.5">
          <div className="relative">
            <MapPin
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={employee.selectedLocation ?? ""}
              onChange={handleLocationChange}
              disabled={!isPresent}
              aria-label={`Location for ${employee.name}`}
              className="h-9 w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white pl-8 pr-2.5 text-[11px] font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {isPresent ? "Select location" : "Location not required"}
              </option>

              {orderedLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =========================
            STATUS + SHIFT
        ========================= */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {/* Status */}
          <select
            value={employee.status}
            onChange={handleStatusChange}
            aria-label={`Status for ${employee.name}`}
            className={`h-9 w-full cursor-pointer rounded-md border bg-white px-2 text-[11px] font-semibold text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 ${styles.select}`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Shift */}
          <div className="relative">
            <Clock3
              size={12}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={employee.shift ?? ""}
              onChange={handleShiftChange}
              disabled={!isPresent}
              aria-label={`Shift for ${employee.name}`}
              className="h-9 w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white pl-6 pr-2 text-[11px] font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">{isPresent ? "Shift" : "Not required"}</option>

              {shiftOptions.map((shift) => (
                <option key={shift.value} value={shift.value}>
                  {shift.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =========================
            REMARKS
        ========================= */}
        <div className="relative mt-2">
          <MessageSquare
            size={12}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id={`remarks-${employee.employeeId}`}
            type="text"
            value={employee.remarks}
            onChange={handleRemarksChange}
            placeholder="Remarks..."
            autoComplete="off"
            className="h-9 w-full rounded-md border border-slate-300 bg-white pl-8 pr-2.5 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>
    </article>
  );
}
