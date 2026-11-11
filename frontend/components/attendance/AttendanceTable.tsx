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

import { buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

interface AttendanceTableProps {
  employees: AttendanceEmployee[];
}

export default function AttendanceTable({ employees }: AttendanceTableProps) {
  if (!employees.length) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No attendance records"
        description="No attendance records match the current filters."
      />
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-sm">
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                           */}
          {/* ---------------------------------------------------------------- */}

          <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-500">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">
                Employee
              </th>

              <th className="px-3 py-3 font-medium">
                Designation
              </th>

              <th className="px-3 py-3 font-medium">
                Status
              </th>

              <th className="px-3 py-3 font-medium">
                Shift
              </th>

              <th className="px-3 py-3 font-medium">
                Location
              </th>

              <th className="px-3 py-3 font-medium">
                Remarks
              </th>

              <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          {/* ---------------------------------------------------------------- */}
          {/* Body                                                             */}
          {/* ---------------------------------------------------------------- */}

          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => (
              <tr
                key={employee.attendanceId}
                className="group transition-colors hover:bg-slate-50/60"
              >
                {/* -------------------------------------------------------- */}
                {/* Employee                                                   */}
                {/* -------------------------------------------------------- */}

                <td className="px-4 py-2.5">
                  <div className="flex min-w-50 items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                      <UserRound className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate font-medium text-slate-900"
                        title={employee.name}
                      >
                        {employee.name}
                      </p>

                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                        <span>{employee.empId}</span>

                        <span className="text-slate-300">•</span>

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
                  <span className="inline-flex max-w-35 items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/15">
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
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 ring-1 ring-inset ring-slate-500/15">
                      <Clock3 className="size-3.5 text-slate-500" />

                      <span className="text-xs font-medium capitalize">
                        {employee.shift}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>

                {/* -------------------------------------------------------- */}
                {/* Location                                                   */}
                {/* -------------------------------------------------------- */}

                <td className="px-3 py-2.5">
                  {employee.sector || employee.location ? (
                    <div className="flex max-w-45 items-start gap-2">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />

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
                            className="truncate text-xs text-slate-400"
                            title={employee.location}
                          >
                            {employee.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>

                {/* -------------------------------------------------------- */}
                {/* Remarks                                                    */}
                {/* -------------------------------------------------------- */}

                <td className="max-w-45 px-3 py-2.5">
                  {employee.remarks ? (
                    <div className="flex items-start gap-2">
                      <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-slate-400" />

                      <p
                        className="truncate text-xs leading-5 text-slate-400"
                        title={employee.remarks}
                      >
                        {employee.remarks}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
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
                    className={buttonVariants({
                      variant: "secondary",
                      size: "icon-sm",
                    })}
                  >
                    <ArrowUpRight />
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

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {employees.length}
          </span>{" "}
          {employees.length === 1 ? "employee" : "employees"}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="size-1.5 rounded-full bg-blue-600" />
          Attendance records
        </div>
      </div>
    </div>
  );
}
