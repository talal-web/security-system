import type { AttendanceShift, AttendanceStatus } from "./attendance";

// ======================================
// LOCATION
// ======================================

export interface AttendanceSessionLocation {
  _id: string;
  name: string;
  sector: string;
}

// ======================================
// EMPLOYEE CARD
// ======================================

export interface AttendanceSessionEmployee {
  employeeId: string;
  empId: string;

  name: string;
  fatherName: string;

  designation: string;
  sector: string;

  currentLocation: AttendanceSessionLocation | null;

  // Editable fields
  selectedLocation: string | null;
  status: AttendanceStatus;
  shift: AttendanceShift;
  remarks: string;
}

// ======================================
// GET ATTENDANCE SESSION
// GET /attendance/session
// ======================================

export interface AttendanceSessionResponse {
  success: boolean;

  employees: AttendanceSessionEmployee[];

  locations: AttendanceSessionLocation[];
}

// ======================================
// MARK ATTENDANCE SESSION
// POST /attendance/mark/session
// ======================================

export interface MarkAttendanceEmployeePayload {
  employeeId: string;

  locationId: string | null;

  status: AttendanceStatus;

  shift: AttendanceShift;

  remarks?: string;
}

export interface MarkAttendanceSessionPayload {
  date: string;

  employees: MarkAttendanceEmployeePayload[];
}

export interface MarkAttendanceSessionResponse {
  success: boolean;
  message: string;
  totalEmployees: number;
}
