export type AttendanceStatus = "present" | "absent" | "leave";

export type AttendanceShift = "day" | "night";

export interface AttendanceFilters {
  status?: AttendanceStatus;

  shift?: AttendanceShift;

  date?: string;
}

export interface SectorAttendanceRecord {
  _id: string;
  empId: string;
  name: string;
  fatherName: string;
  location: string;
  sector: string;
  shift: AttendanceShift;
  status: AttendanceStatus;
  date: string;
}

export interface SectorAttendanceGroup {
  sector: string;
  total: number;
  records: SectorAttendanceRecord[];
}

export interface AttendanceGlobalStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
  day: number;
  night: number;
}

export interface SectorAttendanceResponse {
  success: boolean;
  message: string;

  data: {
    globalStats: AttendanceGlobalStats;
    sectors: SectorAttendanceGroup[];
  };
}
