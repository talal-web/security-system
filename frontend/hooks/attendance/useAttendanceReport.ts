"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceReport,
  getMonthlyAttendanceReport,
} from "@/services/attendance.service";
import { attendanceKeys } from "./useAttendance";

import type {
  AttendanceFilters,
  MonthlyAttendanceFilters,
  MonthlyAttendanceResponse,
} from "@/types/attendance";
import type { AttendanceReportResponse } from "@/types/attendance-report";

export { attendanceKeys } from "./useAttendance";

// ============================
// DAILY REPORT
// ============================

export function useAttendanceReport(filters?: AttendanceFilters) {
  return useQuery<AttendanceReportResponse, Error>({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => getAttendanceReport(filters),
    staleTime: 1000 * 60,
  });
}

// ============================
// MONTHLY REPORT
// ============================

export function useMonthlyAttendanceReport(filters: MonthlyAttendanceFilters) {
  return useQuery<MonthlyAttendanceResponse, Error>({
    queryKey: attendanceKeys.monthlyList(filters),
    queryFn: () => getMonthlyAttendanceReport(filters),
    enabled: Boolean(filters.month),
    staleTime: 1000 * 60 * 5,
  });
}
