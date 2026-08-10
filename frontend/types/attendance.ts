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
}

// ======================================
// EMPLOYEE
// ======================================

export interface AttendanceEmployee {
  attendanceId: string;
  employeeId: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: EmployeeDesignation;
  status: AttendanceStatus;
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
}

export type AttendanceGlobalStats = AttendanceReportGlobalStats;
