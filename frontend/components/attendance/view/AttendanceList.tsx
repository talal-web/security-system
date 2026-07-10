"use client";

import { useState } from "react";
import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import AttendanceSectorTable from "./AttendanceSectorTable";
import ViewAttendanceFilters from "./AttendanceFilters";
import AttendanceStats from "./AttendanceStats";
import AttendanceEmployeeTable from "./AttendanceEmployeeTable";
import { useAttendanceExport } from "@/hooks/attendance/useAttendanceExport";
import { getSectorRows } from "@/utils/attendance/attendanceHelper";
import {
  getShiftStyle,
  getStatusStyle,
} from "@/utils/attendance/attendanceStyles";

import type { AttendanceFilters } from "@/types/attendance";

import { getTodayDate } from "@/utils/attendance/date";

export default function AttendanceList() {
  const [filters, setFilters] = useState<AttendanceFilters>(() => ({
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
      {globalStats && <AttendanceStats stats={globalStats} />}

      {/* ================= FILTERS ================= */}
      <ViewAttendanceFilters filters={filters} setFilters={setFilters} />

      <div className="flex items-center justify-end">
        <button
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
          className="ml-4 rounded bg-indigo-600 px-3 py-1 text-white disabled:opacity-50"
        >
          {isExporting ? "Exporting..." : "Export All"}
        </button>
      </div>

      {/* ================= SECTORS ================= */}
      {presentSectors.length > 0 ? (
        presentSectors.map((sector) => (
          <AttendanceSectorTable
            key={sector.sector}
            sector={sector}
            getSectorRows={getSectorRows}
            getStatusStyle={getStatusStyle}
            getShiftStyle={getShiftStyle}
          />
        ))
      ) : (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
          No present employees found
        </div>
      )}

      {/* ================= ABSENT ================= */}

      {absentEmployees.length > 0 && (
        <AttendanceEmployeeTable
          title="Absent Employees"
          status="absent"
          employees={absentEmployees}
        />
      )}

      {/* ================= LEAVE ================= */}

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
