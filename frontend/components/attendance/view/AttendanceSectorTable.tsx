"use client";

import type {
  AttendanceSector,
  AttendanceShift,
  AttendanceStatus,
} from "@/types/attendance";

import { formatSectorName } from "@/utils/formatSectorName";

interface AttendanceSectorTableProps {
  sector: AttendanceSector;

  getSectorRows: (sector: AttendanceSector) => {
    location: AttendanceSector["locations"][number];
    record: AttendanceSector["locations"][number]["records"][number];
  }[];

  getStatusStyle: (status: AttendanceStatus) => string;

  getShiftStyle: (shift: AttendanceShift) => string;
}

export default function AttendanceSectorTable({
  sector,
  getSectorRows,
  getStatusStyle,
  getShiftStyle,
}: AttendanceSectorTableProps) {
  const rows = getSectorRows(sector);

  const totalEmployees = sector.locations.reduce(
    (sum, location) => sum + location.totalEmployees,
    0,
  );

  const sectorTitle = sector.sector?.trim()
    ? formatSectorName(sector.sector)
    : "No Sector";

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Sector Header */}
      <div className="flex flex-col gap-1 border-b bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{sectorTitle}</h2>

          <p className="text-xs text-gray-500">Employee Attendance Records</p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {totalEmployees} Employees • {sector.locations.length} Locations
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[950px] w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="w-16 px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Father Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {(() => {
              let serial = 1;

              return sector.locations.flatMap((location) => {
                const locationName = location.name?.trim() || "No Location";

                return [
                  // Location Header
                  <tr key={`location-${location._id}`} className="bg-blue-50">
                    <td
                      colSpan={7}
                      className="border-y border-blue-200 px-4 py-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📍</span>

                          <span className="font-semibold text-blue-900">
                            {locationName}
                          </span>
                        </div>

                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {location.totalEmployees} Employees
                        </span>
                      </div>
                    </td>
                  </tr>,

                  // Employee Rows
                  ...location.records.map((record) => {
                    const shiftText = record.shift?.trim() || "No Shift";

                    return (
                      <tr
                        key={record.attendanceId}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-center font-medium text-slate-600">
                          {serial++}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {record.name}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {record.fatherName}
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {locationName}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={getShiftStyle(record.shift)}>
                            {shiftText}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={getStatusStyle(record.status)}>
                            {record.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  }),
                ];
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
