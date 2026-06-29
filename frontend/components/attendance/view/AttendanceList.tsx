"use client";

import { useState } from "react";
import { useAttendances } from "@/hooks/attendance/useAttendance";
import AttendanceSectorTable from "./AttendanceSectorTable";
import ViewAttendanceFilters from "./AttendanceFilters";
import AttendanceStats from "./AttendanceStats";

import type {
  AttendanceFilters,
  AttendanceStatus,
  AttendanceShift,
  AttendanceSector,
} from "@/types/attendance";

export default function AttendanceList() {
  const [filters, setFilters] = useState<AttendanceFilters>({});

  const { data, isLoading, error } = useAttendances(filters);

  const globalStats = data?.data?.globalStats;
  const sectorGroups: AttendanceSector[] = data?.data?.sectors ?? [];

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

  const getSectorRows = (sector: AttendanceSector) => {
    return sector.locations.flatMap((location) =>
      location.records.map((record) => ({
        location,
        record,
      })),
    );
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
      {globalStats && <AttendanceStats stats={globalStats} />}

      {/* ================= FILTERS ================= */}
      <ViewAttendanceFilters filters={filters} setFilters={setFilters} />

      {/* ================= SECTORS ================= */}
      {sectorGroups.length > 0 ? (
        sectorGroups.map((sector) => (
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
          No attendance records found
        </div>
      )}
    </div>
  );
}
