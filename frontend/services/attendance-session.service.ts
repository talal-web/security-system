import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  AttendanceSessionResponse,
  MarkAttendanceSessionPayload,
  MarkAttendanceSessionResponse,
  UpdateEmployeeLocationsPayload,
  UpdateEmployeeLocationsResponse,
  UpdateEmployeeShiftsPayload,
  UpdateEmployeeShiftsResponse,
} from "@/types/attendance-session";

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export async function getAttendanceSession(
  areaId: string,
): Promise<AttendanceSessionResponse> {
  try {
    const res = await api.get<AttendanceSessionResponse>(
      "/attendance/session",
      {
        params: { area: areaId },
      },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// UPDATE EMPLOYEE LOCATIONS
// ======================================

export async function updateEmployeeLocations(
  payload: UpdateEmployeeLocationsPayload,
  areaId: string,
): Promise<UpdateEmployeeLocationsResponse> {
  try {
    const res = await api.patch<UpdateEmployeeLocationsResponse>(
      "/attendance/session/locations",
      { ...payload, area: areaId },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// UPDATE EMPLOYEE SHIFTS
// ======================================

export async function updateEmployeeShifts(
  payload: UpdateEmployeeShiftsPayload,
  areaId: string,
): Promise<UpdateEmployeeShiftsResponse> {
  try {
    const res = await api.patch<UpdateEmployeeShiftsResponse>(
      "/attendance/session/shifts",
      { ...payload, area: areaId },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

// ======================================
// MARK ATTENDANCE SESSION
// ======================================

export async function markAttendanceSession(
  payload: MarkAttendanceSessionPayload,
  areaId: string,
): Promise<MarkAttendanceSessionResponse> {
  try {
    const res = await api.post<MarkAttendanceSessionResponse>(
      "/attendance/session",
      { ...payload, area: areaId },
    );

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
