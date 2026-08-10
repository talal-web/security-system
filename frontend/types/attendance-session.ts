import type { AttendanceShift, AttendanceStatus } from "./attendance";
import type { EmployeeShift } from "./employee";

export interface AttendanceSectorSummary {
  _id: string | null;
  name: string;
  code: string;
}

// ======================================
// SESSION EMPLOYEE
// ======================================

export interface AttendanceSessionEmployee {
  employeeId: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  defaultShift: EmployeeShift | null;
}

// ======================================
// SESSION LOCATION
// ======================================

export interface AttendanceSessionLocation {
  _id: string;
  name: string;
  sector: AttendanceSectorSummary;
  sortOrder: number;
  isActive: boolean;
  employeeCount: number;
  employees: AttendanceSessionEmployee[];
}

// ======================================
// SESSION SECTOR
// ======================================

export interface AttendanceSessionSector {
  sector: AttendanceSectorSummary;
  totalEmployees: number;
  totalLocations: number;
  locations: AttendanceSessionLocation[];
}

// ======================================
// SESSION STATS
// ======================================

export interface AttendanceSessionStats {
  totalEmployees: number;
  totalLocations: number;
  totalSectors: number;
}

// ======================================
// GET /api/attendance/session
// ======================================

export interface AttendanceSessionResponse {
  success: boolean;
  attendanceDate: string;
  alreadyMarked: boolean;
  stats: AttendanceSessionStats;
  sectors: AttendanceSessionSector[];
}

// ======================================
// FRONTEND EMPLOYEE STATE
// ======================================

export interface AttendanceFormEmployee extends AttendanceSessionEmployee {
  selectedLocation: string | null;
  status: AttendanceStatus;
  shift: AttendanceShift | null;
  remarks: string;
}

// ======================================
// FRONTEND LOCATION STATE
// ======================================

export interface AttendanceFormLocation extends Omit<
  AttendanceSessionLocation,
  "employees"
> {
  employees: AttendanceFormEmployee[];
}

// ======================================
// FRONTEND SECTOR STATE
// ======================================

export interface AttendanceFormSector {
  sector: AttendanceSectorSummary;
  totalEmployees: number;
  totalLocations: number;
  locations: AttendanceFormLocation[];
}

// ======================================
// PATCH /api/attendance/session/locations
// ======================================

export interface UpdateEmployeeLocationPayload {
  employeeId: string;
  locationId: string;
}

export interface UpdateEmployeeLocationsPayload {
  employees: UpdateEmployeeLocationPayload[];
}

export interface UpdateEmployeeLocationsResponse extends AttendanceSessionResponse {
  message: string;
}

// ======================================
// POST /api/attendance/session
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
