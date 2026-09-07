"use client";

import type { AttendanceGlobalStats } from "@/types/attendance";

interface AttendanceStatsProps {
  stats: AttendanceGlobalStats;
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Attendance Report</h1>
          <p className="text-xs text-gray-500">Workforce snapshot</p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />

          <span className="text-xs font-medium text-red-700">Absent</span>

          <span className="rounded-md bg-red-100 px-2 py-0.5 text-sm font-bold text-red-700">
            {stats.absent}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-lg border bg-white sm:grid-cols-3 lg:grid-cols-5">
        <div className="border-b p-3 sm:border-r lg:border-b-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Total
          </p>
          <p className="mt-0.5 text-xl font-bold text-gray-900">
            {stats.total}
          </p>
        </div>

        <div className="border-b bg-yellow-50 p-3 sm:border-r lg:border-b-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-yellow-700">
            Leave
          </p>
          <p className="mt-0.5 text-xl font-bold text-yellow-600">
            {stats.leave}
          </p>
        </div>

        <div className="border-b bg-green-50 p-3 lg:border-r lg:border-b-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700">
            Present
          </p>
          <p className="mt-0.5 text-xl font-bold text-green-600">
            {stats.present}
          </p>
        </div>

        <div className="border-r bg-blue-50 p-3 sm:border-b-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            Day Shift
          </p>
          <p className="mt-0.5 text-xl font-bold text-blue-600">{stats.day}</p>
        </div>

        <div className="bg-indigo-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
            Night Shift
          </p>
          <p className="mt-0.5 text-xl font-bold text-indigo-600">
            {stats.night}
          </p>
        </div>
      </div>
    </div>
  );
}
