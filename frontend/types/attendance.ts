import type { EmployeeDesignation } from "./employee";
import type { AttendanceReportGlobalStats } from "./attendance-report";

// ======================================
// SHARED ATTENDANCE TYPES
// ======================================

export type AttendanceStatus = "present" | "absent" | "leave";

export type AttendanceShift = "day" | "night";

// ======================================
// FILTERS
// ======================================

export interface AttendanceFilters {
  status?: AttendanceStatus;
  shift?: AttendanceShift;
  date?: string;
  area?: string;
}

// ======================================
// LOCATION SNAPSHOT
// ======================================

export interface AttendanceLocationSnapshot {
  locationId: string | null;
  name: string;
  sector: string;
}

// ======================================
// EMPLOYEE SNAPSHOT
// ======================================

export interface AttendanceEmployeeSnapshot {
  empId: string;
  name: string;
  fatherName: string;
  designation: EmployeeDesignation;
}

// ======================================
// SINGLE ATTENDANCE RECORD
// ======================================

export interface AttendanceRecord {
  _id: string;

  employee: string;

  employeeSnapshot: AttendanceEmployeeSnapshot;

  date: string;

  status: AttendanceStatus;

  /**
   * Only present attendance has a shift.
   */
  shift: AttendanceShift | null;

  /**
   * Only present attendance has an attendance location.
   */
  location: string | null;

  locationSnapshot: AttendanceLocationSnapshot;

  remarks: string;

  createdAt?: string;

  updatedAt?: string;
}

// ======================================
// SINGLE ATTENDANCE RESPONSE
// ======================================

export interface AttendanceRecordResponse {
  success: boolean;
  message: string;
  data: AttendanceRecord;
}

// ======================================
// UPDATE ATTENDANCE
// ======================================

export interface UpdateAttendancePayload {
  status?: AttendanceStatus;

  /**
   * Required when status is present.
   * Should be null/omitted for absent or leave.
   */
  shift?: AttendanceShift | null;

  /**
   * Required when status is present.
   * Should be null/omitted for absent or leave.
   */
  location?: string | null;

  remarks?: string;
}

// ======================================
// UPDATE ATTENDANCE RESPONSE
// ======================================

export interface UpdateAttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceRecord;
}

// ======================================
// ATTENDANCE EMPLOYEE
// ======================================

export interface AttendanceEmployee {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

  designation: EmployeeDesignation;

  status: AttendanceStatus;

  shift: AttendanceShift | null;

  sectorId?: string;

  sector?: string;

  location?: string;

  remarks: string;

  date: string;
}

// ======================================
// EXPORT
// ======================================

export interface AttendanceExportRow {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

  designation: string;

  sector?: string;

  location?: string;

  shift?: AttendanceShift;

  status: AttendanceStatus;

  remarks: string;

  date: string;
}

// ======================================
// MONTHLY ATTENDANCE
// ======================================

export type MonthlyAttendanceStatus = "P" | "L" | "A" | "-";

export interface MonthlyAttendanceSummary {
  total: number;
  present: number;
  leave: number;
  absent: number;
}

export interface MonthlyAttendanceEmployee {
  employeeId: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: EmployeeDesignation;

  summary: MonthlyAttendanceSummary;

  attendance: Record<string, MonthlyAttendanceStatus>;
}

export interface MonthlyAttendanceOverall {
  employees: number;
  total: number;
  present: number;
  leave: number;
  absent: number;
}

export interface MonthlyAttendanceMonth {
  value: string;
  year: number;
  month: number;
  days: number;
}

export interface MonthlyAttendanceData {
  month: MonthlyAttendanceMonth;
  overall: MonthlyAttendanceOverall;
  employees: MonthlyAttendanceEmployee[];
}

export interface MonthlyAttendanceResponse {
  success: boolean;
  message: string;
  data: MonthlyAttendanceData;
}

export interface MonthlyAttendanceFilters {
  month: string;
  area?: string;
}

// ======================================
// GLOBAL STATS
// ======================================

export type AttendanceGlobalStats = AttendanceReportGlobalStats;
