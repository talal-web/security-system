import type { AttendanceFormEmployee } from "@/types/attendance-session";

export type AttendanceDraftEmployee = Pick<
  AttendanceFormEmployee,
  "employeeId" | "status" | "shift" | "selectedLocation" | "remarks"
>;

export type AttendanceDraft = {
  employees: AttendanceDraftEmployee[];
  savedAt: string;
  expiresAt: string;
};

export const getDraftKey = (userId: string, date: string) =>
  `attendance-draft-${userId}-${date}`;

export const createAttendanceDraft = (
  employees: AttendanceFormEmployee[],
  attendanceDate: string,
): AttendanceDraft => {
  const savedAt = new Date();
  const expiresAt = new Date(`${attendanceDate}T00:00:00+05:00`);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + 1);

  return {
    employees: employees.map((employee) => ({
      employeeId: employee.employeeId,
      status: employee.status,
      shift: employee.shift,
      selectedLocation: employee.selectedLocation,
      remarks: employee.remarks,
    })),
    savedAt: savedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
};

export const readDraft = (key: string): AttendanceDraft | null => {
  if (typeof window === "undefined") return null;

  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");

    if (
      !value ||
      typeof value !== "object" ||
      !Array.isArray((value as AttendanceDraft).employees) ||
      typeof (value as AttendanceDraft).savedAt !== "string" ||
      typeof (value as AttendanceDraft).expiresAt !== "string"
    ) {
      return null;
    }

    const draft = value as AttendanceDraft;

    if (
      Number.isNaN(Date.parse(draft.savedAt)) ||
      Number.isNaN(Date.parse(draft.expiresAt)) ||
      Date.parse(draft.expiresAt) <= Date.now()
    ) {
      localStorage.removeItem(key);
      return null;
    }

    return draft;
  } catch {
    return null;
  }
};

export const saveAttendanceDraft = (key: string, draft: AttendanceDraft) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(draft));
};

export const removeAttendanceDraft = (key: string) => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
};
