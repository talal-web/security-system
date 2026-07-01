import type { AttendanceShift, AttendanceStatus } from "./attendance";
import { EmployeeShift } from "./employee";

// ======================================
// LOCATION
// ======================================

export interface AttendanceSessionLocation {
  _id: string;
  name: string;
  sector: string;
  isActive: boolean;
}

// ======================================
// EMPLOYEE
// ======================================

export interface AttendanceSessionEmployee {
  employeeId: string;
  empId: string;

  name: string;
  fatherName: string;

  designation: string;
  sector: string;

  defaultShift: EmployeeShift | null;

  currentLocation: AttendanceSessionLocation | null;
}

// ======================================
// SECTOR
// ======================================

export interface AttendanceSessionSector {
  sector: string;

  totalEmployees: number;
  totalLocations: number;

  locations: AttendanceSessionLocation[];

  employees: AttendanceSessionEmployee[];
}

// ======================================
// STATS
// ======================================

export interface AttendanceSessionStats {
  totalEmployees: number;
  totalLocations: number;
  totalSectors: number;
}

// ======================================
// GET ATTENDANCE SESSION
// GET /attendance/session
// ======================================

export interface AttendanceSessionResponse {
  success: boolean;

  attendanceDate: string;

  alreadyMarked: boolean;

  stats: AttendanceSessionStats;

  sectors: AttendanceSessionSector[];
}

// ======================================
// FRONTEND ATTENDANCE FORM STATE
// ======================================

export interface AttendanceFormEmployee extends AttendanceSessionEmployee {
  selectedLocation: string | null;

  status: AttendanceStatus;

  shift: AttendanceShift | null;

  remarks: string;
}

// ======================================
// FRONTEND SECTOR STATE
// ======================================

export interface AttendanceFormSector {
  sector: string;

  totalEmployees: number;
  totalLocations: number;

  locations: AttendanceSessionLocation[];

  employees: AttendanceFormEmployee[];
}

// ======================================
// MARK ATTENDANCE SESSION
// POST /attendance/mark/session
// ======================================

export interface MarkAttendanceEmployeePayload {
  employeeId: string;

  locationId: string | null;

  status: AttendanceStatus;

  shift: AttendanceShift | null;

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
