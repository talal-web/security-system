"use client";

import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

interface AttendanceHeaderProps {
  attendanceDate: string;
  alreadyMarked: boolean;
}

export default function AttendanceHeader({
  attendanceDate,
  alreadyMarked,
}: AttendanceHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-red-50 shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
            <ClipboardCheck className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Attendance Session
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Mark and manage daily employee attendance across all security
              sectors.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <CalendarDays className="h-5 w-5 text-blue-600" />

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Attendance Date
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {attendanceDate}
              </p>
            </div>
          </div>

          {/* Session Status */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 shadow-sm ${
              alreadyMarked
                ? "border-amber-200 bg-amber-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            {alreadyMarked ? (
              <Clock3 className="h-5 w-5 text-amber-600" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Session Status
              </p>

              <p
                className={`text-sm font-semibold ${
                  alreadyMarked ? "text-amber-700" : "text-green-700"
                }`}
              >
                {alreadyMarked ? "Already Marked" : "New Session"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
