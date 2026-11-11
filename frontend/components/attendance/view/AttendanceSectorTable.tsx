"use client";

import { Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";

import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";
import type { AttendanceReportSector } from "@/types/attendance-report";

interface AttendanceSectorTableProps {
  sector: AttendanceReportSector;

  getSectorRows: (sector: AttendanceReportSector) => {
    location: AttendanceReportSector["locations"][number];
    record: AttendanceReportSector["locations"][number]["records"][number];
  }[];

  getStatusStyle: (status: AttendanceStatus) => string;

  getShiftStyle: (shift: AttendanceShift) => string;
}

export default function AttendanceSectorTable({
  sector,
  getStatusStyle,
  getShiftStyle,
}: AttendanceSectorTableProps) {
  const totalEmployees = sector.locations.reduce(
    (sum, location) => sum + location.totalEmployees,
    0,
  );

  const sectorTitle = sector.sector?.trim() ? sector.sector : "No Sector";

  return (
    <Card className="overflow-hidden">
      {/* Sector Header */}
      <CardHeader
        icon={Building2}
        title={sectorTitle}
        description={`${sector.sectorId || "Unassigned"} • Employee Attendance Records`}
        actions={
          <Badge tone="info" className="tabular-nums">
            {totalEmployees} Employees • {sector.locations.length} Locations
          </Badge>
        }
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-237.5 w-full text-sm">
          <thead className="bg-slate-50/80 text-left text-xs font-medium text-slate-500">
            <tr>
              <th className="w-16 px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Father Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {(() => {
              let serial = 1;

              return sector.locations.flatMap((location) => {
                const locationName = location.name?.trim() || "No Location";

                return [
                  // Location Header
                  <tr
                    key={`location-${location._id}`}
                    className="bg-slate-50/60"
                  >
                    <td colSpan={8} className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-3.5 text-slate-400" />

                          <span className="text-xs font-semibold text-slate-700">
                            {locationName}
                          </span>
                        </div>

                        <Badge tone="neutral" className="tabular-nums">
                          {location.totalEmployees} Employees
                        </Badge>
                      </div>
                    </td>
                  </tr>,

                  // Employee Rows
                  ...location.records.map((record) => {
                    const shiftText = record.shift?.trim() || "No Shift";

                    return (
                      <tr
                        key={record.attendanceId}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 text-center text-slate-500 tabular-nums">
                          {serial++}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-900">
                          {record.name}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {record.fatherName}
                        </td>

                        <td className="px-4 py-3">
                          <Badge tone="neutral">{locationName}</Badge>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`${getShiftStyle(
                              record.shift || ("" as AttendanceShift),
                            )} capitalize`}
                          >
                            {shiftText}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`${getStatusStyle(record.status)} capitalize`}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-600 tabular-nums">
                          {new Date(record.date).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <ButtonLink
                            href={`/attendance/${record.attendanceId}`}
                            variant="secondary"
                            size="sm"
                          >
                            View
                          </ButtonLink>
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
    </Card>
  );
}
