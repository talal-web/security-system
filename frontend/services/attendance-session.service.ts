import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type {
  AttendanceSessionResponse,
  MarkAttendanceSessionPayload,
  MarkAttendanceSessionResponse,
} from "@/types/attendance-session";

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export async function getAttendanceSession(): Promise<AttendanceSessionResponse> {
  try {
    const res = await api.get("/attendance/session");

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
): Promise<MarkAttendanceSessionResponse> {
  try {
    const res = await api.post("/attendance/mark/session", payload);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
