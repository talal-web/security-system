"use client";

import { X, Users, CheckCircle2, XCircle, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/Button";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

interface AttendancePreviewStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
}

interface AttendanceSubmitPreviewModalProps {
  open: boolean;

  presentSectors: AttendanceFormSector[];
  absentEmployees: AttendanceFormEmployee[];
  leaveEmployees: AttendanceFormEmployee[];
  stats: AttendancePreviewStats;

  isLoading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

function EmployeeChip({ employee }: { employee: AttendanceFormEmployee }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {employee.name}
        </p>
        <p className="truncate font-mono text-[11px] text-slate-500">
          {employee.empId}
        </p>
      </div>

      <span
        className={[
          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
          employee.shift === "night"
            ? "bg-indigo-50 text-indigo-700 ring-indigo-600/20"
            : "bg-amber-50 text-amber-700 ring-amber-600/20",
        ].join(" ")}
      >
        {employee.shift === "night" ? "Night" : "Day"}
      </span>
    </div>
  );
}

function StatusChip({
  employee,
  tone,
}: {
  employee: AttendanceFormEmployee;
  tone: "red" | "amber";
}) {
  const styles =
    tone === "red"
      ? "border-red-200 bg-red-50/60"
      : "border-amber-200 bg-amber-50/60";

  return (
    <div className={["rounded-lg border px-3 py-2", styles].join(" ")}>
      <p className="truncate text-sm font-medium text-slate-900">
        {employee.name}
      </p>
      <p className="truncate font-mono text-[11px] text-slate-500">
        {employee.empId}
      </p>
    </div>
  );
}

export default function AttendanceSubmitPreviewModal({
  open,
  presentSectors,
  absentEmployees,
  leaveEmployees,
  stats,
  isLoading = false,
  onConfirm,
  onCancel,
}: AttendanceSubmitPreviewModalProps) {
  if (!open) return null;

  const statCards: Array<{
    label: string;
    value: number;
    icon: typeof Users;
    text: string;
  }> = [
    { label: "Total", value: stats.total, icon: Users, text: "text-slate-700" },
    {
      label: "Present",
      value: stats.present,
      icon: CheckCircle2,
      text: "text-emerald-700",
    },
    {
      label: "Absent",
      value: stats.absent,
      icon: XCircle,
      text: "text-red-700",
    },
    {
      label: "Leave",
      value: stats.leave,
      icon: CalendarClock,
      text: "text-amber-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={isLoading ? undefined : onCancel}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-preview-title"
        className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden border border-slate-200 bg-white shadow-pop sm:h-auto sm:max-h-[90vh] sm:rounded-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="attendance-preview-title"
              className="text-base font-semibold tracking-tight text-slate-900"
            >
              Review Attendance Before Submitting
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Check who is assigned to each sector and location, and who is
              marked absent or on leave, before you submit today&apos;s
              attendance.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close"
            className="text-slate-400"
          >
            <X />
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:grid-cols-4 sm:px-6">
          {statCards.map(({ label, value, icon: Icon, text }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-card"
            >
              <Icon className={`h-4 w-4 shrink-0 ${text}`} />

              <div>
                <p className="text-base font-semibold leading-5 text-slate-900 tabular-nums">
                  {value}
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
          {/* Present, grouped by sector -> location */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Present — by Sector &amp; Location
            </h3>

            {presentSectors.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
                No employees marked present.
              </p>
            ) : (
              <div className="space-y-4">
                {presentSectors.map((sector) => (
                  <div
                    key={sector.sector._id ?? "unassigned"}
                    className="overflow-hidden rounded-xl border border-slate-200/80"
                  >
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {sector.sector.name}
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {sector.locations
                        .filter((location) => location.employees.length > 0)
                        .map((location) => (
                          <div key={location._id} className="px-4 py-3">
                            <p className="mb-2 text-xs font-medium text-slate-500">
                              {location.name} · {location.employees.length}{" "}
                              {location.employees.length === 1
                                ? "employee"
                                : "employees"}
                            </p>

                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {location.employees.map((employee) => (
                                <EmployeeChip
                                  key={employee.employeeId}
                                  employee={employee}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Absent */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-red-700">
              Absent ({absentEmployees.length})
            </h3>

            {absentEmployees.length === 0 ? (
              <p className="text-sm text-slate-400">None</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {absentEmployees.map((employee) => (
                  <StatusChip
                    key={employee.employeeId}
                    employee={employee}
                    tone="red"
                  />
                ))}
              </div>
            )}
          </section>

          {/* Leave */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-amber-700">
              On Leave ({leaveEmployees.length})
            </h3>

            {leaveEmployees.length === 0 ? (
              <p className="text-sm text-slate-400">None</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {leaveEmployees.map((employee) => (
                  <StatusChip
                    key={employee.employeeId}
                    employee={employee}
                    tone="amber"
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Back to Edit
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Submitting..." : "Confirm & Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
