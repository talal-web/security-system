import type { AttendanceFormEmployee } from "@/types/attendance-session";
import type { AttendanceFormSector } from "@/types/attendance-session";
import type { AttendanceStatus } from "@/types/attendance";

const ATTENDANCE_DRAFT_VERSION = 1;

export type AttendanceDraftEmployee = Pick<
  AttendanceFormEmployee,
  "employeeId" | "status" | "remarks"
>;

export type AttendanceDraft = {
  version: number;
  date: string;
  savedAt: string;
  employees: AttendanceDraftEmployee[];
};

export const getDraftKey = (userId: string, date: string) =>
  `attendance-draft:${userId}:${date}`;

export const createAttendanceDraft = (
  employees: AttendanceFormEmployee[],
  attendanceDate: string,
): AttendanceDraft => {
  return {
    version: ATTENDANCE_DRAFT_VERSION,
    date: attendanceDate,
    savedAt: new Date().toISOString(),
    employees: employees.map((employee) => ({
      employeeId: employee.employeeId,
      status: employee.status,
      remarks: employee.remarks,
    })),
  };
};

export const readDraft = (key: string): AttendanceDraft | null => {
  if (typeof window === "undefined") return null;

  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null");

    if (
      !value ||
      typeof value !== "object" ||
      (value as AttendanceDraft).version !== ATTENDANCE_DRAFT_VERSION ||
      typeof (value as AttendanceDraft).date !== "string" ||
      !Array.isArray((value as AttendanceDraft).employees) ||
      typeof (value as AttendanceDraft).savedAt !== "string"
    ) {
      return null;
    }

    const draft = value as AttendanceDraft;

    if (Number.isNaN(Date.parse(draft.savedAt))) {
      localStorage.removeItem(key);
      return null;
    }

    return draft;
  } catch {
    return null;
  }
};

export const mergeAttendanceDraft = (
  sectors: AttendanceFormSector[],
  draft: AttendanceDraft,
): AttendanceFormSector[] => {
  const employeesById = new Map(
    sectors
      .flatMap((sector) =>
        sector.locations.flatMap((location) => location.employees),
      )
      .map((employee) => [employee.employeeId, employee]),
  );
  const validStatuses: AttendanceStatus[] = ["present", "absent", "leave"];
  const draftByEmployeeId = new Map(
    draft.employees.map((employee) => [employee.employeeId, employee]),
  );
  const mergedEmployees = new Map(
    employeesById.entries().map(([employeeId, employee]) => {
      const saved = draftByEmployeeId.get(employeeId);

      if (!saved || !validStatuses.includes(saved.status)) {
        return [employeeId, employee];
      }

      return [
        employeeId,
        {
          ...employee,
          status: saved.status,
          shift: saved.status === "present" ? employee.shift : null,
          selectedLocation:
            saved.status === "present" ? employee.selectedLocation : null,
          remarks:
            typeof saved.remarks === "string"
              ? saved.remarks
              : employee.remarks,
        },
      ];
    }),
  );

  return sectors.map((sector) => ({
    ...sector,
    locations: sector.locations.map((location) => {
      const employees = [...mergedEmployees.values()].filter((employee) =>
        employee.status === "present"
          ? employee.selectedLocation === location._id
          : employee.currentLocation === location._id,
      );

      return { ...location, employeeCount: employees.length, employees };
    }),
  }));
};

export const saveAttendanceDraft = (key: string, draft: AttendanceDraft) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(draft));
};

export const removeAttendanceDraft = (key: string) => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
};
