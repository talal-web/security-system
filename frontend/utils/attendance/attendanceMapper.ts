import type { AttendanceExportRow } from "@/types/attendance";
import type {
  AttendanceReportAbsentLeaveEmployee,
  AttendanceReportSector,
} from "@/types/attendance-report";

export function mapAttendanceEmployee(
  employee: AttendanceReportAbsentLeaveEmployee,
  status: "absent" | "leave",
): AttendanceExportRow {
  return {
    attendanceId: employee.attendanceId,
    employeeId: employee.employeeId,
    empId: employee.empId,
    name: employee.name,
    fatherName: employee.fatherName,
    designation: employee.designation ?? "-",
    sector: employee.sector ?? "-",
    location: employee.location ?? "-",
    shift: employee.shift ?? undefined,

    status,
    remarks: employee.remarks || "",
    date: employee.date,
  };
}

export function mapPresentEmployees(
  presentSectors: AttendanceReportSector[],
): AttendanceExportRow[] {
  return presentSectors.flatMap((sector) =>
    sector.locations.flatMap((location) =>
      location.records.map((record) => ({
        ...record,
        designation: record.designation ?? "-",
        sector: sector.sector,
        location: location.name,
        shift: record.shift ?? undefined,
      })),
    ),
  );
}
