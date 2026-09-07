"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react";

import type { AttendanceEmployee } from "@/types/attendance";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

interface AttendanceCardProps {
  employee: AttendanceEmployee;
}

export default function AttendanceCard({ employee }: AttendanceCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-slate-100 bg-white px-3.5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Employee Avatar */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UserRound className="size-4" />
            </div>

            {/* Employee Identity */}
            <div className="min-w-0">
              <h3
                className="truncate text-sm font-semibold sm:text-base"
                title={employee.name}
              >
                {employee.name}
              </h3>

              <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
                <span>{employee.empId}</span>

                <span className="text-border">•</span>

                <span className="truncate" title={`S/O ${employee.fatherName}`}>
                  S/O {employee.fatherName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <AttendanceStatusBadge status={employee.status} />
            <Link
              href={`/attendance/${employee.attendanceId}`}
              aria-label={`View attendance for ${employee.name}`}
              title="View attendance"
              className="flex size-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Attendance Details                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="p-3.5">
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <InfoItem label="Designation" value={employee.designation || "—"} />

          <InfoItem
            label="Shift"
            value={employee.shift ? capitalize(employee.shift) : "—"}
            icon={employee.shift ? <Clock3 className="size-3.5" /> : undefined}
          />

          <InfoItem
            label="Sector"
            value={employee.sector || "—"}
            icon={employee.sector ? <MapPin className="size-3.5" /> : undefined}
          />

          <InfoItem
            label="Location"
            value={employee.location || "—"}
            icon={
              employee.location ? <MapPin className="size-3.5" /> : undefined
            }
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Remarks                                                           */}
        {/* ---------------------------------------------------------------- */}

        {employee.remarks && (
          <div className="mt-3 flex gap-2 rounded-lg border border-slate-100 bg-blue-50/50 px-2.5 py-2">
            <div className="mt-0.5 shrink-0">
              <FileText className="size-3.5 text-muted-foreground" />
            </div>

            <p
              className="line-clamp-2 wrap-break-wordtext-xs leading-5 text-muted-foreground"
              title={employee.remarks}
            >
              {employee.remarks}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Item                                                                  */
/* -------------------------------------------------------------------------- */

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
  return (
    <div className="min-w-0 border-b border-r px-2.5 py-2 last:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="flex min-w-0 items-center gap-1.5">
        {icon && <span className="shrink-0 text-slate-400">{icon}</span>}

        <p className="truncate text-xs font-semibold" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
