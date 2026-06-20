"use client";

import { useState } from "react";
import { useAttendances } from "@/hooks/attendance/useAttendance";

import type {
  AttendanceFilters,
  AttendanceStatus,
  AttendanceShift,
  SectorAttendanceGroup,
} from "@/types/attendance";

export default function AttendanceList() {
  const [filters, setFilters] = useState<AttendanceFilters>({});

  const { data, isLoading, error } = useAttendances(filters);

  const globalStats = data?.data?.globalStats;
  const sectorGroups: SectorAttendanceGroup[] = data?.data?.sectors ?? [];

  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700";

      case "absent":
        return "inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700";

      case "leave":
        return "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700";

      default:
        return "inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
    }
  };

  const getShiftStyle = (shift: AttendanceShift) => {
    return shift === "day"
      ? "inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
      : "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {error.message || "Failed to load attendance."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      {globalStats && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Attendance Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Real-time workforce tracking
              </p>
            </div>

            {/* Absent (small alert badge) */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-700">Absent</span>
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-sm font-bold text-red-700">
                {globalStats.absent}
              </span>
            </div>
          </div>

          {/* ================= KPI CARDS ================= */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats.total}
              </p>
            </div>

            <div className="rounded-xl border bg-green-50 p-4 shadow-sm">
              <p className="text-xs text-green-700">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {globalStats.present}
              </p>
            </div>

            <div className="rounded-xl border bg-blue-50 p-4 shadow-sm">
              <p className="text-xs text-blue-700">Day Shift</p>
              <p className="text-2xl font-bold text-blue-600">
                {globalStats.day}
              </p>
            </div>

            <div className="rounded-xl border bg-indigo-50 p-4 shadow-sm">
              <p className="text-xs text-indigo-700">Night Shift</p>
              <p className="text-2xl font-bold text-indigo-600">
                {globalStats.night}
              </p>
            </div>

            <div className="rounded-xl border bg-yellow-50 p-4 shadow-sm">
              <p className="text-xs text-yellow-700">Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {globalStats.leave}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILTERS ================= */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={filters.status ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: (e.target.value as AttendanceStatus) || undefined,
              }))
            }
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>

          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={filters.shift ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                shift: (e.target.value as AttendanceShift) || undefined,
              }))
            }
          >
            <option value="">All Shifts</option>
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>

          <input
            type="date"
            className="rounded-lg border px-3 py-2 text-sm"
            value={filters.date ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                date: e.target.value || undefined,
              }))
            }
          />
        </div>
      </div>

      {/* ================= SECTORS ================= */}
      {sectorGroups.length > 0 ? (
        sectorGroups.map((group) => (
          <div
            key={group.sector}
            className="rounded-xl border bg-white shadow-sm"
          >
            {/* Sector Header */}
            <div className="flex flex-col gap-1 border-b bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{group.sector}</h2>
                <p className="text-xs text-gray-500">
                  Employee Attendance Records
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {group.records.length} Records
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Emp ID</th>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Father</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {group.records.map((attendance) => (
                    <tr
                      key={attendance._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">
                        {attendance.empId}
                      </td>
                      <td className="px-4 py-3">{attendance.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {attendance.fatherName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {attendance.location}
                      </td>
                      <td className="px-4 py-3">
                        <span className={getShiftStyle(attendance.shift)}>
                          {attendance.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusStyle(attendance.status)}>
                          {attendance.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(attendance.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
          No attendance records found
        </div>
      )}
    </div>
  );
}
