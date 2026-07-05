import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/apiError";

import type { AttendanceFilters, AttendanceResponse } from "@/types/attendance";

export async function getAttendanceBySector(
  filters?: AttendanceFilters,
): Promise<AttendanceResponse> {
  try {
    const res = await api.get("/attendance/report", {
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
