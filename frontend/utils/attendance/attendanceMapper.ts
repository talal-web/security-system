import type {
  AttendanceExportRow,
  AttendanceNonPresentEmployee,
  AttendanceSector,
} from "@/types/attendance";

export function mapAttendanceEmployee(
  employee: AttendanceNonPresentEmployee,
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
    shift: employee.shift ?? "-",

    status,
    remarks: employee.remarks || "",
    date: employee.date,
  };
}

export function mapPresentEmployees(
  presentSectors: AttendanceSector[],
): AttendanceExportRow[] {
  return presentSectors.flatMap((sector) =>
    sector.locations.flatMap((location) =>
      location.records.map((record) => ({
        ...record,
        designation: record.designation ?? "-",
        sector: sector.sector,
        location: location.name,
      })),
    ),
  );
}
