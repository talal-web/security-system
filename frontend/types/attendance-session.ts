import type { AttendanceShift, AttendanceStatus } from "./attendance";
import { EmployeeShift } from "./employee";

// EMPLOYEE
export interface AttendanceSessionEmployee {
  employeeId: string;

  empId: string;

  name: string;
  fatherName: string;

  designation: string;

  defaultShift: EmployeeShift | null;

  currentLocation?: Pick<
    AttendanceSessionLocation,
    "_id" | "name" | "isActive"
  > | null;
}
// LOCATION
export interface AttendanceSessionLocation {
  _id: string;

  name: string;

  sortOrder: number;

  isActive: boolean;

  employeeCount: number;

  employees: AttendanceSessionEmployee[];
}

// SECTOR
export interface AttendanceSessionSector {
  sector: string;

  totalEmployees: number;

  totalLocations: number;

  locations: AttendanceSessionLocation[];
}

// STATS
export interface AttendanceSessionStats {
  totalEmployees: number;

  totalLocations: number;

  totalSectors: number;
}

// GET /attendance/session
export interface AttendanceSessionResponse {
  success: boolean;

  attendanceDate: string;

  alreadyMarked: boolean;

  stats: AttendanceSessionStats;

  sectors: AttendanceSessionSector[];
}

// FRONTEND EMPLOYEE STATE

export interface AttendanceFormEmployee extends AttendanceSessionEmployee {
  selectedLocation: string | null;

  status: AttendanceStatus;

  shift: AttendanceShift | null;

  remarks: string;
}

// FRONTEND LOCATION STATE
export interface AttendanceFormLocation extends Omit<
  AttendanceSessionLocation,
  "employees" | "employeeCount"
> {
  employeeCount: number;

  employees: AttendanceFormEmployee[];
}

// FRONTEND SECTOR STATE
export interface AttendanceFormSector {
  sector: string;

  totalEmployees: number;

  totalLocations: number;

  locations: AttendanceFormLocation[];
}

// MARK ATTENDANCE SESSION
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
