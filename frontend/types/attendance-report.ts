import type { AttendanceShift, AttendanceStatus } from "./attendance";

// ======================================
// REPORT EMPLOYEE
// ======================================

export interface AttendanceReportEmployee {
  attendanceId: string;
  employeeId: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  shift: AttendanceShift | null;
  status: AttendanceStatus;
  date: string;
  remarks: string;
}

// ======================================
// REPORT LOCATION
// ======================================

export interface AttendanceReportLocation {
  _id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  totalEmployees: number;
  records: AttendanceReportEmployee[];
}

// ======================================
// REPORT SECTOR
// ======================================

export interface AttendanceReportSector {
  sectorId: string;
  sector: string;
  locations: AttendanceReportLocation[];
}

// ======================================
// ABSENT / LEAVE EMPLOYEE
// ======================================

export interface AttendanceReportAbsentLeaveEmployee {
  attendanceId: string;
  employeeId: string;
  empId: string;
  name: string;
  fatherName: string;
  designation: string;
  sectorId: string | null;
  sector: string;
  location: string;
  shift: AttendanceShift | null;
  date: string;
  remarks: string;
}

// ======================================
// GLOBAL STATS
// ======================================

export interface AttendanceReportGlobalStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
  day: number;
  night: number;
}

// ======================================
// REPORT DATA
// ======================================

export interface AttendanceReportData {
  globalStats: AttendanceReportGlobalStats;
  presentSectors: AttendanceReportSector[];
  absentEmployees: AttendanceReportAbsentLeaveEmployee[];
  leaveEmployees: AttendanceReportAbsentLeaveEmployee[];
}

// ======================================
// GET /api/attendance
// ======================================

export interface AttendanceReportResponse {
  success: boolean;
  message: string;
  data: AttendanceReportData;
}
