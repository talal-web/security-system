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
// ATTENDANCE RECORD
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
}

// ======================================
// LOCATION
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
// SECTOR
// ======================================

export interface AttendanceSector {
  sector: string;

  locations: AttendanceLocation[];
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
// RESPONSE
// ======================================

export interface AttendanceResponse {
  success: boolean;

  message: string;

  data: {
    globalStats: AttendanceGlobalStats;

    sectors: AttendanceSector[];
  };
}
