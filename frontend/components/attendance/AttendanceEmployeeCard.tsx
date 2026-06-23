"use client";

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
    activeClass: "bg-green-600 text-white border-green-600 shadow-sm",
  },
  {
    value: "absent",
    label: "Absent",
    activeClass: "bg-red-600 text-white border-red-600 shadow-sm",
  },
  {
    value: "leave",
    label: "Leave",
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-sm",
  },
] as const;

const shiftOptions = [
  {
    value: "day",
    label: "Day",
  },
  {
    value: "night",
    label: "Night",
  },
] as const;

export default function AttendanceEmployeeCard({
  employee,
  locations,
  selected,
  onSelect,
  onUpdate,
}: AttendanceEmployeeCardProps) {
  const initials = employee.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const borderColor =
    employee.status === "present"
      ? "border-green-300"
      : employee.status === "absent"
        ? "border-red-300"
        : employee.status === "leave"
          ? "border-amber-300"
          : "border-slate-200";

  return (
    <div
      className={`relative rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md ${borderColor}`}
    >
      {/* Checkbox */}

      <div className="absolute right-3 top-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4"
        />
      </div>

      {/* Header */}

      <div className="mb-3 flex flex-col gap-3 pr-6 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{employee.name}</h3>

            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium">
              {employee.empId}
            </span>
          </div>

          <p className="mt-1 truncate text-[11px] text-slate-500">
            {employee.designation}
          </p>
        </div>
      </div>

      {/* Location */}

      <div className="mb-3 rounded-lg bg-slate-50 px-2 py-1.5">
        <p className="truncate text-[11px] text-slate-600">
          📍 {employee.currentLocation?.name ?? "Not Assigned"}
        </p>
      </div>

      {/* Status */}

      <div className="mb-3">
        <div className="grid grid-cols-3 gap-1">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() =>
                onUpdate(employee.employeeId, "status", status.value)
              }
              className={`rounded-md border py-2 text-[11px] font-semibold transition ${
                employee.status === status.value
                  ? status.activeClass
                  : "border-slate-300 bg-white"
              }`}
            >
              {status.value === "present"
                ? "P"
                : status.value === "absent"
                  ? "A"
                  : "L"}
            </button>
          ))}
        </div>
      </div>

      {/* Shift */}

      <div className="mb-3">
        <div className="grid grid-cols-2 gap-1">
          {shiftOptions.map((shift) => (
            <button
              key={shift.value}
              type="button"
              onClick={() =>
                onUpdate(employee.employeeId, "shift", shift.value)
              }
              className={`rounded-md border py-2 text-[11px] font-semibold transition ${
                employee.shift === shift.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {shift.value === "day" ? "D" : "N"}
            </button>
          ))}
        </div>
      </div>

      {/* Location Select */}

      <select
        value={employee.selectedLocation ?? ""}
        onChange={(e) =>
          onUpdate(
            employee.employeeId,
            "selectedLocation",
            e.target.value || null,
          )
        }
        className="mb-2 w-full rounded-lg border px-2 py-2 text-xs"
      >
        <option value="">Location</option>

        {locations.map((location) => (
          <option key={location._id} value={location._id}>
            {location.name}
          </option>
        ))}
      </select>

      {/* Remarks */}

      <input
        type="text"
        value={employee.remarks}
        onChange={(e) =>
          onUpdate(employee.employeeId, "remarks", e.target.value)
        }
        placeholder="Remark"
        className="w-full rounded-lg border px-2 py-2 text-xs"
      />
    </div>
  );
}
