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
// PRESENT RECORD
// ======================================

export interface AttendanceRecord {
  attendanceId: string;

  employeeId: string;

  empId: string;

  name: string;

  fatherName: string;

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
