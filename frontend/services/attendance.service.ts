import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  AttendanceFilters,
  AttendanceRecord,
  AttendanceRecordResponse,
  MonthlyAttendanceFilters,
  MonthlyAttendanceResponse,
  UpdateAttendancePayload,
  UpdateAttendanceResponse,
} from "@/types/attendance";

import type { AttendanceReportResponse } from "@/types/attendance-report";

// ======================================
// DAILY ATTENDANCE REPORT
// ======================================

export async function getAttendanceReport(
  filters: AttendanceFilters | undefined,
  areaId: string,
): Promise<AttendanceReportResponse> {
  try {
    const res = await api.get<AttendanceReportResponse>("/attendance/report", {
      params: {
        status: filters?.status,
        shift: filters?.shift,
        date: filters?.date,
        area: areaId,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// SINGLE ATTENDANCE RECORD
// ======================================

export async function getAttendanceById(
  id: string,
  areaId: string,
): Promise<AttendanceRecord> {
  try {
    const res = await api.get<AttendanceRecordResponse>(`/attendance/${id}`, {
      params: { area: areaId },
    });

    return res.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// UPDATE SINGLE ATTENDANCE RECORD
// ======================================

export async function updateAttendance(
  id: string,
  payload: UpdateAttendancePayload,
  areaId: string,
): Promise<AttendanceRecord> {
  try {
    const res = await api.patch<UpdateAttendanceResponse>(
      `/attendance/${id}`,
      { ...payload, area: areaId },
    );

    return res.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// MONTHLY ATTENDANCE REPORT
// ======================================

export async function getMonthlyAttendanceReport(
  filters: MonthlyAttendanceFilters,
  areaId: string,
): Promise<MonthlyAttendanceResponse> {
  try {
    const res = await api.get<MonthlyAttendanceResponse>(
      "/attendance/report/monthly",
      {
        params: {
          ...filters,
          area: areaId,
        },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
