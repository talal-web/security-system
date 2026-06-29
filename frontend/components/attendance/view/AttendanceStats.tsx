"use client";

import type { AttendanceGlobalStats } from "@/types/attendance";

interface AttendanceStatsProps {
  stats: AttendanceGlobalStats;
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Attendance Dashboard
          </h1>

          <p className="text-sm text-gray-500">Real-time workforce tracking</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />

          <span className="text-xs font-medium text-red-700">Absent</span>

          <span className="rounded-md bg-red-100 px-2 py-0.5 text-sm font-bold text-red-700">
            {stats.absent}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Active</p>

          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-xl border bg-yellow-50 p-4 shadow-sm">
          <p className="text-xs text-yellow-700">Leave</p>

          <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
        </div>

        <div className="rounded-xl border bg-green-50 p-4 shadow-sm">
          <p className="text-xs text-green-700">Present</p>

          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </div>

        <div className="rounded-xl border bg-blue-50 p-4 shadow-sm">
          <p className="text-xs text-blue-700">Day Shift</p>

          <p className="text-2xl font-bold text-blue-600">{stats.day}</p>
        </div>

        <div className="rounded-xl border bg-indigo-50 p-4 shadow-sm">
          <p className="text-xs text-indigo-700">Night Shift</p>

          <p className="text-2xl font-bold text-indigo-600">{stats.night}</p>
        </div>
      </div>
    </div>
  );
}
