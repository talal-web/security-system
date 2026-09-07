"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import { useAttendanceExport } from "@/hooks/attendance/useAttendanceExport";
import type { AttendanceFilters as AttendanceFiltersType } from "@/types/attendance";
import { getSectorRows } from "@/utils/attendance/attendanceHelper";
import {
  getShiftStyle,
  getStatusStyle,
} from "@/utils/attendance/attendanceStyles";
import { getTodayDate } from "@/utils/attendance/date";

import AttendanceEmployeeTable from "./view/AttendanceEmployeeTable";
import AttendanceFilters from "./view/AttendanceFilters";
import AttendanceSectorTable from "./view/AttendanceSectorTable";
import AttendanceStats from "./view/AttendanceStats";

export default function AttendanceReport() {
  const [filters, setFilters] = useState<AttendanceFiltersType>(() => ({
    date: getTodayDate(),
  }));

  const { data, isLoading, error } = useAttendanceReport(filters);
  const globalStats = data?.data?.globalStats;
  const presentSectors = data?.data?.presentSectors ?? [];
  const absentEmployees = data?.data?.absentEmployees ?? [];
  const leaveEmployees = data?.data?.leaveEmployees ?? [];
  const { exportAll, isExporting } = useAttendanceExport();

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-slate-500">Loading attendance report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">
          {error.message || "Failed to load attendance."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {globalStats && <AttendanceStats stats={globalStats} />}

      <AttendanceFilters filters={filters} setFilters={setFilters} />

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            exportAll({
              globalStats,
              presentSectors,
              absentEmployees,
              leaveEmployees,
              date: filters.date ?? "",
            })
          }
          disabled={isExporting}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-3.5" />
          {isExporting ? "Exporting..." : "Export All"}
        </button>
      </div>

      {presentSectors.length > 0 ? (
        <div className="space-y-4">
          {presentSectors.map((sector) => (
            <AttendanceSectorTable
              key={sector.sectorId || sector.sector}
              sector={sector}
              getSectorRows={getSectorRows}
              getStatusStyle={getStatusStyle}
              getShiftStyle={getShiftStyle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No present employees found.
        </div>
      )}

      {absentEmployees.length > 0 && (
        <AttendanceEmployeeTable
          title="Absent Employees"
          status="absent"
          employees={absentEmployees}
        />
      )}

      {leaveEmployees.length > 0 && (
        <AttendanceEmployeeTable
          title="Leave Employees"
          status="leave"
          employees={leaveEmployees}
        />
      )}
    </div>
  );
}
