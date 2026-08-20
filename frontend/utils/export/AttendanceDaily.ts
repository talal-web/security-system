import type {
  AttendanceExportRow,
  AttendanceGlobalStats,
} from "@/types/attendance";

interface ExportAttendanceToExcelOptions {
  employees: AttendanceExportRow[];
  title: string;
  globalStats?: AttendanceGlobalStats;
}

const formatAttendanceStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    present: "Present",
    absent: "Absent",
    leave: "Leave",
  };

  return statusMap[status ?? ""] ?? "-";
};

const formatAttendanceShift = (shift?: string) => {
  const shiftMap: Record<string, string> = {
    day: "Day",
    night: "Night",
  };

  return shiftMap[shift ?? ""] ?? "-";
};

export async function exportAttendanceToExcel({
  employees,
  title,
  globalStats,
}: ExportAttendanceToExcelOptions): Promise<void> {
  const XLSX = await import("xlsx");
  const { saveAs } = await import("file-saver");

  const worksheet = XLSX.utils.aoa_to_sheet([]);

  let currentRow = 0;

  // ============================================================
  // ATTENDANCE SUMMARY
  // ============================================================

  if (globalStats) {
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["Attendance Summary"],
        ["Day Shift", globalStats.day],
        ["Night Shift", globalStats.night],
        ["Present", globalStats.present],
        ["Leave", globalStats.leave],
        ["Total Employees", globalStats.total],
      ],
      {
        origin: `A${currentRow + 1}`,
      },
    );

    // One blank row after summary
    currentRow += 7;
  }

  // ============================================================
  // GROUP EMPLOYEES BY SECTOR + LOCATION
  // ============================================================

  const groupedEmployees = new Map<
    string,
    Map<string, AttendanceExportRow[]>
  >();

  for (const employee of employees) {
    const sector = employee.sector ?? "-";
    const location = employee.location ?? "-";

    if (!groupedEmployees.has(sector)) {
      groupedEmployees.set(sector, new Map());
    }

    const locationMap = groupedEmployees.get(sector)!;

    if (!locationMap.has(location)) {
      locationMap.set(location, []);
    }

    locationMap.get(location)!.push(employee);
  }

  // ============================================================
  // EMPLOYEE TABLE HEADER — ONLY ONCE
  // ============================================================

  const headers = ["#", "Name", "Father Name", "Shift", "Status"];

  XLSX.utils.sheet_add_aoa(worksheet, [headers], {
    origin: `A${currentRow + 1}`,
  });

  currentRow += 1;

  // ============================================================
  // CREATE LOCATION GROUPS
  // ============================================================

  for (const [, locationMap] of groupedEmployees) {
    for (const [location, locationEmployees] of locationMap) {
      // --------------------------------------------------------
      // Location
      // --------------------------------------------------------

      XLSX.utils.sheet_add_aoa(worksheet, [[location]], {
        origin: `A${currentRow + 1}`,
      });

      currentRow += 1;

      // --------------------------------------------------------
      // Employees
      // --------------------------------------------------------

      const tableData = locationEmployees.map((employee, index) => [
        index + 1,
        employee.name ?? "-",
        employee.fatherName ?? "-",
        formatAttendanceShift(employee.shift),
        formatAttendanceStatus(employee.status),
      ]);

      XLSX.utils.sheet_add_aoa(worksheet, tableData, {
        origin: `A${currentRow + 1}`,
      });

      currentRow += tableData.length;

      // One blank row between locations
      currentRow += 1;
    }
  }
  // CREATE LOCATION GROUPS
  // ============================================================

  let employeeNumber = 1;

  for (const [, locationMap] of groupedEmployees) {
    for (const [location, locationEmployees] of locationMap) {
      // --------------------------------------------------------
      // Location
      // --------------------------------------------------------

      XLSX.utils.sheet_add_aoa(worksheet, [[`${location}`]], {
        origin: `A${currentRow + 1}`,
      });

      currentRow += 1;

      // --------------------------------------------------------
      // Employees
      // --------------------------------------------------------

      const tableData = locationEmployees.map((employee) => [
        employeeNumber++,
        employee.name ?? "-",
        employee.fatherName ?? "-",
        formatAttendanceShift(employee.shift),
        formatAttendanceStatus(employee.status),
      ]);

      XLSX.utils.sheet_add_aoa(worksheet, tableData, {
        origin: `A${currentRow + 1}`,
      });

      currentRow += tableData.length;

      // One blank row between locations
      currentRow += 1;
    }
  }

  // ============================================================
  // COLUMN WIDTHS
  // ============================================================

  worksheet["!cols"] = [
    { wch: 6 }, // #
    { wch: 22 }, // Name
    { wch: 22 }, // Father Name
    { wch: 12 }, // Shift
    { wch: 14 }, // Status
  ];

  // ============================================================
  // CREATE WORKBOOK
  // ============================================================

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  // ============================================================
  // GENERATE EXCEL FILE
  // ============================================================

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `${title}.xlsx`,
  );
}
