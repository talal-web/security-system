"use client";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";

interface AttendanceHeaderProps {
  attendanceDate: string;
  alreadyMarked: boolean;
}

export default function AttendanceHeader({
  attendanceDate,
  alreadyMarked,
}: AttendanceHeaderProps) {
  return (
    <PageHeader
      title="Attendance Session"
      description="Mark and manage daily employee attendance across all security sectors."
      icon={ClipboardCheck}
      actions={
        <>
          {/* Date */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-card">
            <CalendarDays className="size-4 text-slate-500" />

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Attendance Date
              </p>

              <p className="text-sm font-semibold text-slate-900 tabular-nums">
                {attendanceDate}
              </p>
            </div>
          </div>

          {/* Session Status */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-card">
            {alreadyMarked ? (
              <Clock3 className="size-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-600" />
            )}

            <div>
              <p className="text-[11px] font-medium text-slate-500">
                Session Status
              </p>

              <Badge tone={alreadyMarked ? "warning" : "success"}>
                {alreadyMarked ? "Already Marked" : "New Session"}
              </Badge>
            </div>
          </div>
        </>
      }
    />
  );
}
