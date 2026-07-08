"use client";

import { useState } from "react";
import { useAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import AttendanceSectorTable from "./AttendanceSectorTable";
import ViewAttendanceFilters from "./AttendanceFilters";
import AttendanceStats from "./AttendanceStats";
import AttendanceEmployeeTable from "./AttendanceEmployeeTable";

import type {
  AttendanceFilters,
  AttendanceStatus,
  AttendanceShift,
  AttendanceSector,
} from "@/types/attendance";

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

  // Map non-present employee shapes to table-friendly shape (provide missing fields)
  const absentEmployeesMapped = absentEmployees.map((e) => ({
    attendanceId: e.attendanceId,
    employeeId: e.employeeId,
    empId: e.empId,
    name: e.name,
    fatherName: e.fatherName,
    designation: "-",
    status: "absent" as const,
    remarks: e.remarks || "",
    date: e.date,
  }));

  const leaveEmployeesMapped = leaveEmployees.map((e) => ({
    attendanceId: e.attendanceId,
    employeeId: e.employeeId,
    empId: e.empId,
    name: e.name,
    fatherName: e.fatherName,
    designation: "-",
    status: "leave" as const,
    remarks: e.remarks || "",
    date: e.date,
  }));

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

  const getShiftStyle = (shift?: AttendanceShift | null) => {
    if (!shift) {
      return "inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200";
    }

    return shift === "day"
      ? "inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
      : "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-200";
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
