"use client";

import { useMemo, type ChangeEvent } from "react";
import { MapPin, Moon, Sun } from "lucide-react";

import type { AttendanceFormEmployee } from "@/types/attendance-session";
import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";

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
  shortLabel: string;
}> = [
  {
    value: "present",
    label: "Present",
    shortLabel: "P",
  },
  {
    value: "leave",
    label: "Leave",
    shortLabel: "L",
  },
  {
    value: "absent",
    label: "Absent",
    shortLabel: "A",
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
      };

    case "leave":
      return {
        accent: "bg-amber-500",
        avatar: "bg-amber-50 text-amber-700",
        border: "border-amber-200",
      };

    case "present":
    default:
      return {
        accent: "bg-blue-500",
        avatar: "bg-blue-50 text-blue-700",
        border: "border-blue-200",
      };
  }
}

function getStatusButtonStyles(status: AttendanceStatus, isActive: boolean) {
  if (!isActive) {
    switch (status) {
      case "absent":
        return "text-red-600 hover:bg-red-50";

      case "leave":
        return "text-amber-600 hover:bg-amber-50";

      case "present":
      default:
        return "text-blue-600 hover:bg-blue-50";
    }
  }

  switch (status) {
    case "absent":
      return "bg-red-500 text-white shadow-sm";

    case "leave":
      return "bg-amber-500 text-white shadow-sm";

    case "present":
    default:
      return "bg-blue-500 text-white shadow-sm";
  }
}

function getShiftTagStyles(shift: AttendanceShift | null) {
  if (shift === "day") {
    return {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100",
      icon: "text-blue-500",
      label: "Day",
    };
  }

  if (shift === "night") {
    return {
      wrapper:
        "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100",
      icon: "text-indigo-500",
      label: "Night",
    };
  }

  return {
    wrapper:
      "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100",
    icon: "text-slate-400",
    label: "Shift",
  };
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

  const shiftStyles = getShiftTagStyles(employee.shift);

  /*
   * Toggle:
   * Day -> Night
   * Night -> Day
   * Empty -> Day
   */
  const handleShiftToggle = () => {
    if (!isPresent) {
      return;
    }

    const nextShift: AttendanceShift =
      employee.shift === "day" ? "night" : "day";

    onUpdate(employee.employeeId, "shift", nextShift);
  };

  const handleStatusChange = (status: AttendanceStatus) => {
    onUpdate(employee.employeeId, "status", status);

    // Shift and location are only required
    // when employee is Present.
    if (status !== "present") {
      onUpdate(employee.employeeId, "shift", null);
    }
  };

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value;

    if (!locationId) {
      return;
    }

    onLocationChange(employee.employeeId, locationId);
  };

  const ShiftIcon = employee.shift === "night" ? Moon : Sun;

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
      <div
        className={["absolute inset-y-0 left-0 w-0.5", styles.accent].join(" ")}
      />

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

          {/* Employee Information */}
          <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-3">
            {/* Name + Father Name */}
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-bold leading-4 text-slate-900">
                {employee.name}
              </h3>

              <p className="mt-0.5 truncate text-[10px] font-medium leading-3.5 text-slate-500">
                {employee.fatherName || "Father name not available"}
              </p>
            </div>

            {/* Employee ID + Designation */}
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
              className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
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
        <div className="mt-2 flex items-center gap-2">
          {/* =====================
              STATUS: P / L / A
          ===================== */}
          <div
            className="flex h-8 min-w-0 flex-1 overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-0.5"
            role="group"
            aria-label={`Status for ${employee.name}`}
          >
            {statusOptions.map((option) => {
              const isActive = employee.status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  title={option.label}
                  aria-label={`${option.label} for ${employee.name}`}
                  aria-pressed={isActive}
                  className={[
                    "flex flex-1 items-center justify-center",
                    "rounded-[4px]",
                    "text-[11px] font-bold",
                    "transition-all duration-150",
                    "focus:z-10 focus:outline-none",
                    "focus:ring-2 focus:ring-blue-200",
                    "active:scale-95",
                    getStatusButtonStyles(option.value, isActive),
                  ].join(" ")}
                >
                  {option.shortLabel}
                </button>
              );
            })}
          </div>

          {/* =====================
              SHIFT TAG
          ===================== */}
          <button
            type="button"
            disabled={!isPresent}
            onClick={handleShiftToggle}
            title={
              isPresent
                ? `Switch to ${
                    employee.shift === "day" ? "night" : "day"
                  } shift`
                : "Shift not required"
            }
            aria-label={`Current shift: ${employee.shift ?? "not selected"}`}
            className={[
              "flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5",
              "text-[10px] font-bold",
              "transition-all duration-150",
              "active:scale-95",
              isPresent
                ? shiftStyles.wrapper
                : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300",
              isPresent
                ? "focus:outline-none focus:ring-2 focus:ring-blue-200"
                : "",
            ].join(" ")}
          >
            <ShiftIcon
              size={13}
              strokeWidth={2.5}
              className={isPresent ? shiftStyles.icon : "text-slate-300"}
            />

            <span>{isPresent ? shiftStyles.label : "N/A"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
