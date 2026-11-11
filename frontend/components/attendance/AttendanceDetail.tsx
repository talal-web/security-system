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

import { Card, CardHeader } from "@/components/ui/Card";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

// 1px slate dividers between grid cells, without double borders on wrap.
const gridClass =
  "grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4 [&>*]:bg-white";

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

      <Card className="overflow-hidden">
        <CardHeader
          icon={User}
          title={employeeSnapshot.name}
          actions={<AttendanceStatusBadge status={status} />}
          className="items-center"
        />

        <div className={gridClass}>
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
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Attendance Information */}
      {/* ------------------------------------------------------------------ */}

      <Card className="overflow-hidden">
        <CardHeader
          icon={CalendarDays}
          title="Attendance Information"
          description="Details of the employee attendance record"
        />

        <div className={gridClass}>
          <div className="px-4 py-3 sm:px-5">
            <p className="mb-1.5 text-xs font-medium text-slate-500">
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
            <div className="flex gap-2 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2 pt-0.5">
                <FileText className="size-4 text-slate-400" />
              </div>

              <p className="wrap-break-word text-sm leading-5 text-slate-700">
                {remarks || "No remarks added for this attendance record."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Record Information */}
      {/* ------------------------------------------------------------------ */}

      {(createdAt || updatedAt) && (
        <Card className="overflow-hidden">
          <CardHeader
            icon={FileText}
            title="Record Information"
            description="System timestamps for this attendance record"
          />

          <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
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
        </Card>
      )}
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
    <div className="min-w-0 px-4 py-3 sm:px-5">
      <div className="mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-slate-400" />}

        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>

      <p className="wrap-break-word text-sm font-medium leading-5 text-slate-900">
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
