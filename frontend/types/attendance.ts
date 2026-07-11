export type AttendanceStatus = "present" | "absent" | "leave";

export type AttendanceShift = "day" | "night";

import { EmployeeDesignation } from "./employee";

// ======================================
// FILTERS
// ======================================

export interface AttendanceFilters {
  status?: AttendanceStatus;
  shift?: AttendanceShift;
  date?: string;
}

// ======================================
// PRESENT RECORD
// ======================================

export interface AttendanceRecord {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

  designation: EmployeeDesignation;

  shift: AttendanceShift;

  status: AttendanceStatus;

  date: string;

  remarks: string;
}

// ======================================
// PRESENT LOCATION
// ======================================

export interface AttendanceLocation {
  _id: string;

  name: string;

  sortOrder: number;

  isActive: boolean;

  totalEmployees: number;

  records: AttendanceRecord[];
}

// ======================================
// PRESENT SECTOR
// ======================================

export interface AttendanceSector {
  sector: string;

  locations: AttendanceLocation[];
}

// ======================================
// ABSENT / LEAVE EMPLOYEE
// ======================================

export interface AttendanceNonPresentEmployee {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

  designation: EmployeeDesignation;

  sector?: string;

  location?: string;

  shift?: AttendanceShift;

  date: string;

  remarks: string;
}

// ======================================
// GLOBAL STATS
// ======================================

export interface AttendanceGlobalStats {
  total: number;

  present: number;

  absent: number;

  leave: number;

  day: number;

  night: number;
}

// ======================================
// RESPONSE DATA
// ======================================

export interface AttendanceData {
  globalStats: AttendanceGlobalStats;

  presentSectors: AttendanceSector[];

  absentEmployees: AttendanceNonPresentEmployee[];

  leaveEmployees: AttendanceNonPresentEmployee[];
}

// ======================================
// RESPONSE
// ======================================

export interface AttendanceResponse {
  success: boolean;

  message: string;

  data: AttendanceData;
}

export interface AttendanceEmployee {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;
  fatherName: string;

  designation: string;

  status: AttendanceStatus;

  remarks: string;

  date: string;
}

export interface AttendanceExportRow {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;
  fatherName: string;

  designation: string;

  sector?: string;

  location?: string;

  shift?: string;

  status: AttendanceStatus;

  remarks: string;

  date: string;
}

// ======================================
// MONTHLY ATTENDANCE
// ======================================

export type MonthlyAttendanceStatus = "P" | "L" | "A" | "-";

// ======================================
// MONTHLY EMPLOYEE SUMMARY
// ======================================

export interface MonthlyAttendanceSummary {
  total: number;

  present: number;

  leave: number;

  absent: number;
}

// ======================================
// MONTHLY EMPLOYEE
// ======================================

export interface MonthlyAttendanceEmployee {
  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

  designation: EmployeeDesignation;

  summary: MonthlyAttendanceSummary;

  attendance: Record<string, MonthlyAttendanceStatus>;
}

// ======================================
// MONTHLY OVERALL STATS
// ======================================

export interface MonthlyAttendanceOverall {
  employees: number;

  total: number;

  present: number;

  leave: number;

  absent: number;
}

// ======================================
// MONTH INFO
// ======================================

export interface MonthlyAttendanceMonth {
  value: string;

  year: number;

  month: number;

  days: number;
}

// ======================================
// MONTHLY RESPONSE DATA
// ======================================

export interface MonthlyAttendanceData {
  month: MonthlyAttendanceMonth;

  overall: MonthlyAttendanceOverall;

  employees: MonthlyAttendanceEmployee[];
}

// ======================================
// MONTHLY RESPONSE
// ======================================

export interface MonthlyAttendanceResponse {
  success: boolean;

  message: string;

  data: MonthlyAttendanceData;
}

// ======================================
// MONTHLY FILTERS
// ======================================

export interface MonthlyAttendanceFilters {
  month: string; // Format: YYYY-MM
}
