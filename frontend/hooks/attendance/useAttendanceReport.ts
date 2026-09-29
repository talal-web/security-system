"use client";

import { useQuery } from "@tanstack/react-query";

import { useSelectedArea } from "@/components/area/AreaContext";
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
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    ...(selectedAreaId && !filters?.area ? { area: selectedAreaId } : {}),
  };

  return useQuery<AttendanceReportResponse, Error>({
    queryKey: attendanceKeys.list(effectiveFilters),
    queryFn: () => getAttendanceReport(effectiveFilters),
    staleTime: 1000 * 60,
  });
}

// ============================
// MONTHLY REPORT
// ============================

export function useMonthlyAttendanceReport(filters: MonthlyAttendanceFilters) {
  const { selectedAreaId } = useSelectedArea();
  const effectiveFilters = {
    ...filters,
    ...(selectedAreaId && !filters?.area ? { area: selectedAreaId } : {}),
  };

  return useQuery<MonthlyAttendanceResponse, Error>({
    queryKey: attendanceKeys.monthlyList(effectiveFilters),
    queryFn: () => getMonthlyAttendanceReport(effectiveFilters),
    enabled: Boolean(filters.month),
    staleTime: 1000 * 60 * 5,
  });
}
