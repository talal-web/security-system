"use client";

import {
  CalendarDays,
  Clock3,
  FileText,
  IdCard,
  MapPin,
  User,
  UserRound,
} from "lucide-react";

import type { AttendanceRecord } from "@/types/attendance";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

interface AttendanceDetailProps {
  attendance: AttendanceRecord;
}

export default function AttendanceDetail({
  attendance,
}: AttendanceDetailProps) {
  const {
    employeeSnapshot,
    date,
    status,
    shift,
    locationSnapshot,
    remarks,
    createdAt,
    updatedAt,
  } = attendance;

  const formatDate = (value?: string) => {
    if (!value) return "—";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "—";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-3">
      {/* ------------------------------------------------------------------ */}
      {/* Employee Header */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User className="size-4" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">
                  {employeeSnapshot.name}
                </h2>
              </div>
            </div>

            <AttendanceStatusBadge status={status} />
          </div>
        </div>

        <div className="grid divide-x divide-y divide-slate-100 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            icon={IdCard}
            label="Employee ID"
            value={employeeSnapshot.empId}
          />

          <DetailItem
            icon={UserRound}
            label="Father Name"
            value={employeeSnapshot.fatherName}
          />

          <DetailItem
            icon={User}
            label="Designation"
            value={employeeSnapshot.designation || "—"}
          />

          <DetailItem
            icon={CalendarDays}
            label="Attendance Date"
            value={formatDate(date)}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Attendance Information */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={CalendarDays}
          title="Attendance Information"
          description="Details of the employee attendance record"
        />

        <div className="grid divide-x divide-y divide-slate-100 sm:grid-cols-2 lg:grid-cols-4">
          <div className="px-4 py-3">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </p>

            <AttendanceStatusBadge status={status} />
          </div>

          <DetailItem
            icon={Clock3}
            label="Shift"
            value={shift ? capitalize(shift) : "—"}
          />

          <DetailItem
            icon={MapPin}
            label="Sector"
            value={locationSnapshot?.sector || "—"}
          />

          <DetailItem
            icon={MapPin}
            label="Location"
            value={locationSnapshot?.name || "—"}
          />

          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex gap-2 px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
              </div>

              <p className="wrap-break-word text-sm leading-5 text-foreground">
                {remarks || "No remarks added for this attendance record."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Record Information */}
      {/* ------------------------------------------------------------------ */}

      {(createdAt || updatedAt) && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={FileText}
            title="Record Information"
            description="System timestamps for this attendance record"
          />

          <div className="grid divide-x divide-y divide-slate-100 sm:grid-cols-2">
            {createdAt && (
              <DetailItem
                icon={Clock3}
                label="Created"
                value={formatDateTime(createdAt)}
              />
            )}

            {updatedAt && (
              <DetailItem
                icon={Clock3}
                label="Last Updated"
                value={formatDateTime(updatedAt)}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header                                                             */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description?: string;
}

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
        <Icon className="size-3.5" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{title}</h2>

        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail Item                                                                */
/* -------------------------------------------------------------------------- */

interface DetailItemProps {
  icon?: React.ElementType;
  label: string;
  value: string;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="group min-w-0 px-4 py-3">
      <div className="mb-1 flex items-center gap-1.5">
        {Icon && (
          <Icon className="size-3.5 text-slate-400 transition-colors group-hover:text-blue-600" />
        )}

        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="wrap-break-word text-sm font-semibold leading-5 text-foreground">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
