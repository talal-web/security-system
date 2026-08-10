import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  AttendanceFilters,
  MonthlyAttendanceFilters,
  MonthlyAttendanceResponse,
} from "@/types/attendance";

import type { AttendanceReportResponse } from "@/types/attendance-report";

// ======================================
// DAILY ATTENDANCE REPORT
// ======================================

export async function getAttendanceReport(
  filters?: AttendanceFilters,
): Promise<AttendanceReportResponse> {
  try {
    const res = await api.get<AttendanceReportResponse>("/attendance/report", {
      params: {
        status: filters?.status,
        shift: filters?.shift,
        date: filters?.date,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// MONTHLY ATTENDANCE REPORT
// ======================================

export async function getMonthlyAttendanceReport(
  filters: MonthlyAttendanceFilters,
): Promise<MonthlyAttendanceResponse> {
  try {
    const res = await api.get<MonthlyAttendanceResponse>(
      "/attendance/report/monthly",
      {
        params: filters,
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
