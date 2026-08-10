"use client";

import { useState } from "react";

import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import { useAttendanceExport } from "@/hooks/attendance/useAttendanceExport";

import AttendanceSectorTable from "./AttendanceSectorTable";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceStats from "./AttendanceStats";
import AttendanceEmployeeTable from "./AttendanceEmployeeTable";

import { getSectorRows } from "@/utils/attendance/attendanceHelper";
import type { AttendanceFilters as AttendanceFiltersType } from "@/types/attendance";
import {
  getShiftStyle,
  getStatusStyle,
} from "@/utils/attendance/attendanceStyles";
import { getTodayDate } from "@/utils/attendance/date";

export default function AttendanceList() {
  const [filters, setFilters] = useState<AttendanceFiltersType>(() => ({
    date: getTodayDate(),
  }));

  const { data, isLoading, error } = useAttendanceReport(filters);

  const globalStats = data?.data?.globalStats;

  const presentSectors = data?.data?.presentSectors ?? [];

  const absentEmployees = data?.data?.absentEmployees ?? [];

  const leaveEmployees = data?.data?.leaveEmployees ?? [];

  const { exportAll, isExporting } = useAttendanceExport();

  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-slate-500">Loading attendance report...</p>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">
          {error.message || "Failed to load attendance."}
        </p>
      </div>
    );
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      {globalStats && <AttendanceStats stats={globalStats} />}

      {/* ================= FILTERS ================= */}

      <AttendanceFilters filters={filters} setFilters={setFilters} />

      {/* ================= EXPORT ================= */}

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
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "Exporting..." : "Export All"}
        </button>
      </div>

      {/* ================= PRESENT SECTORS ================= */}

      {presentSectors.length > 0 ? (
        <div className="space-y-6">
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
