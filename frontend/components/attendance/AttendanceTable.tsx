"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  Clock3,
  MapPin,
  MessageSquareText,
  UserRound,
} from "lucide-react";

import type { AttendanceEmployee } from "@/types/attendance";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

interface AttendanceTableProps {
  employees: AttendanceEmployee[];
}

export default function AttendanceTable({ employees }: AttendanceTableProps) {
  if (!employees.length) {
    return (
      <div className="flex min-h-55 flex-col items-center justify-center rounded-2xl border bg-card px-6 py-10 text-center shadow-sm">
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarCheck className="size-5" />
        </div>

        <h3 className="text-sm font-semibold">No attendance records</h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
          No attendance records match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-lg border bg-card shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-sm">
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Employee
              </th>

              <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Designation
              </th>

              <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </th>

              <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Shift
              </th>

              <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </th>

              <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Remarks
              </th>

              <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>

          {/* ---------------------------------------------------------------- */}
          {/* Body                                                             */}
          {/* ---------------------------------------------------------------- */}

          <tbody className="divide-y">
            {employees.map((employee) => (
              <tr
                key={employee.attendanceId}
                className="group transition-colors hover:bg-blue-50/60"
              >
                {/* -------------------------------------------------------- */}
                {/* Employee                                                   */}
                {/* -------------------------------------------------------- */}

                <td className="px-4 py-2.5">
                  <div className="flex min-w-50 items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate font-semibold"
                        title={employee.name}
                      >
                        {employee.name}
                      </p>

                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{employee.empId}</span>

                        <span className="text-border">•</span>

                        <span
                          className="truncate"
                          title={`S/O ${employee.fatherName}`}
                        >
                          S/O {employee.fatherName}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* -------------------------------------------------------- */}
                {/* Designation                                                */}
                {/* -------------------------------------------------------- */}

                <td className="px-3 py-2.5">
                  <span className="inline-flex max-w-35 items-center rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-medium text-slate-600">
                    {employee.designation || "—"}
                  </span>
                </td>

                {/* -------------------------------------------------------- */}
                {/* Status                                                     */}
                {/* -------------------------------------------------------- */}

                <td className="px-3 py-2.5">
                  <AttendanceStatusBadge status={employee.status} />
                </td>

                {/* -------------------------------------------------------- */}
                {/* Shift                                                      */}
                {/* -------------------------------------------------------- */}

                <td className="px-3 py-2.5">
                  {employee.shift ? (
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-blue-700">
                      <Clock3 className="size-3.5 text-blue-500" />

                      <span className="text-xs font-medium capitalize">
                        {employee.shift}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>

                {/* -------------------------------------------------------- */}
                {/* Location                                                   */}
                {/* -------------------------------------------------------- */}

                <td className="px-3 py-2.5">
                  {employee.sector || employee.location ? (
                    <div className="flex max-w-45 items-start gap-2">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

                      <div className="min-w-0">
                        {employee.sector && (
                          <p
                            className="truncate text-xs font-semibold"
                            title={employee.sector}
                          >
                            {employee.sector}
                          </p>
                        )}

                        {employee.location && (
                          <p
                            className="truncate text-xs text-muted-foreground"
                            title={employee.location}
                          >
                            {employee.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>

                {/* -------------------------------------------------------- */}
                {/* Remarks                                                    */}
                {/* -------------------------------------------------------- */}

                <td className="max-w-45 px-3 py-2.5">
                  {employee.remarks ? (
                    <div className="flex items-start gap-2">
                      <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

                      <p
                        className="truncate text-xs leading-5 text-muted-foreground"
                        title={employee.remarks}
                      >
                        {employee.remarks}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>

                {/* -------------------------------------------------------- */}
                {/* Action                                                     */}
                {/* -------------------------------------------------------- */}

                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/attendance/${employee.attendanceId}`}
                    aria-label={`View attendance for ${employee.name}`}
                    title="View attendance"
                    className="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-2.5">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {employees.length}
          </span>{" "}
          {employees.length === 1 ? "employee" : "employees"}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="size-1.5 rounded-full bg-primary" />
          Attendance records
        </div>
      </div>
    </div>
  );
}
