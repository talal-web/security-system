"use client";

import type { AttendanceFormEmployee } from "@/types/attendance-session";
import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceAbsentLeaveCardProps {
  employee: AttendanceFormEmployee;

  onUpdate: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
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
        avatar: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/15",
        border: "border-red-200",
      };

    case "leave":
      return {
        accent: "bg-amber-500",
        avatar: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15",
        border: "border-amber-200",
      };

    case "present":
    default:
      return {
        accent: "bg-emerald-500",
        avatar:
          "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15",
        border: "border-slate-200/80",
      };
  }
}

function getStatusButtonStyles(status: AttendanceStatus, isActive: boolean) {
  if (!isActive) {
    switch (status) {
      case "absent":
        return "text-slate-500 hover:bg-red-50 hover:text-red-700";

      case "leave":
        return "text-slate-500 hover:bg-amber-50 hover:text-amber-700";

      case "present":
      default:
        return "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700";
    }
  }

  switch (status) {
    case "absent":
      return "bg-red-600 text-white shadow-sm";

    case "leave":
      return "bg-amber-500 text-white shadow-sm";

    case "present":
    default:
      return "bg-emerald-600 text-white shadow-sm";
  }
}

export default function AttendanceAbsentLeaveCard({
  employee,
  onUpdate,
}: AttendanceAbsentLeaveCardProps) {
  const initials = getInitials(employee.name);
  const styles = getStatusStyles(employee.status);

  const handleStatusChange = (status: AttendanceStatus) => {
    onUpdate(employee.employeeId, "status", status);
  };

  return (
    <article
      className={[
        "relative overflow-hidden rounded-xl border bg-white",
        "shadow-card transition-colors duration-150",
        "hover:border-slate-300",
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
              "rounded-lg text-xs font-semibold",
              styles.avatar,
            ].join(" ")}
          >
            {initials}
          </div>

          {/* Two-column employee information */}
          <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-3">
            {/* LEFT: Name + Father Name */}
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-semibold leading-4 text-slate-900">
                {employee.name}
              </h3>

              <p className="mt-0.5 truncate text-[10px] font-medium leading-3.5 text-slate-500">
                {employee.fatherName || "Father name not available"}
              </p>
            </div>

            {/* RIGHT: Employee ID + Designation */}
            <div className="min-w-0 text-right">
              <p className="truncate font-mono text-[10px] font-semibold leading-4 text-slate-700">
                {employee.empId}
              </p>

              <p className="mt-0.5 max-w-25 truncate text-[10px] font-medium leading-3.5 text-slate-500">
                {employee.designation || "Employee"}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            STATUS: P / L / A
        ========================= */}
        <div
          className="mt-2.5 flex h-8 gap-0.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0.5"
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
                  "rounded-md",
                  "text-[11px] font-semibold",
                  "transition-all duration-150",
                  "focus:z-10 focus:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-blue-500/40",
                  "active:scale-95",
                  getStatusButtonStyles(option.value, isActive),
                ].join(" ")}
              >
                {option.shortLabel}
              </button>
            );
          })}
        </div>

        {/* =========================
            REMARKS
        ========================= */}
        <input
          type="text"
          value={employee.remarks}
          onChange={(event) =>
            onUpdate(employee.employeeId, "remarks", event.target.value)
          }
          placeholder="Remark..."
          autoComplete="off"
          className="mt-2 h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
        />
      </div>
    </article>
  );
}
