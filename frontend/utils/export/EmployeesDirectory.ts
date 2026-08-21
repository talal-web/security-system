import {
  formatDate,
  formatText,
  calculateAge,
} from "../employee/employeeFormat";
import { formatSectorName } from "../formatSectorName";

import type { Employee } from "@/types/employee";

interface ExportEmployeesDirectoryOptions {
  employees: Employee[];
  title?: string;
}

export async function exportEmployeesDirectory({
  employees,
  title = "Employees Directory",
}: ExportEmployeesDirectoryOptions): Promise<void> {
  const XLSX = await import("xlsx");
  const { saveAs } = await import("file-saver");

  const workbook = XLSX.utils.book_new();

  // ======================================
  // HEADER ROW
  // ======================================

  const header = [
    "#",
    "Emp ID",
    "Name",
    "Father Name",
    "CNIC",
    "Date of Birth",
    "Age",
    "Education",
    "Designation",
    "Sector",
    "Current Location",
    "Status",
    "Default Shift",
    "Basic Salary",
    "Address",
    "Phone 1",
    "Phone 2",
    "Reference",
    "Entry Date",
    "Exit Date",
    "Notes",
  ];

  const rows: (string | number)[][] = [
    ["BAIDAR SECURITY SERVICES"],
    [title.toUpperCase()],
    [`Generated On: ${formatDate(new Date().toISOString())}`],
    [`Total Employees: ${employees.length}`],
    [],
    header,
  ];

  // ======================================
  // DATA ROWS
  // ======================================

  employees.forEach((employee, index) => {
    const location =
      typeof employee.currentLocation === "string"
        ? employee.currentLocation
        : (employee.currentLocation?.name ?? "-");

    const age =
      typeof employee.age === "number"
        ? employee.age
        : calculateAge(employee.birthDate);

    rows.push([
      index + 1,
      employee.empId || "-",
      formatText(employee.name),
      formatText(employee.fatherName),
      employee.cnic || "-",
      formatDate(employee.birthDate),
      age,
      employee.education ? formatText(employee.education) : "-",
      formatText(employee.designation),
      employee.sector ? formatSectorName(employee.sector) : "-",
      location || "-",
      formatText(employee.status),
      employee.defaultShift ? formatText(employee.defaultShift) : "-",
      employee.basicSalary ?? 0,
      employee.address || "-",
      employee.phone1 || "-",
      employee.phone2 || "-",
      employee.reference || "-",
      formatDate(employee.entryDate),
      employee.exitDate ? formatDate(employee.exitDate) : "Currently Working",
      employee.notes || "-",
    ]);
  });

  // ======================================
  // SHEET
  // ======================================

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 5 }, // #
    { wch: 12 }, // Emp ID
    { wch: 25 }, // Name
    { wch: 25 }, // Father Name
    { wch: 18 }, // CNIC
    { wch: 14 }, // Date of Birth
    { wch: 6 }, // Age
    { wch: 12 }, // Education
    { wch: 16 }, // Designation
    { wch: 16 }, // Sector
    { wch: 20 }, // Current Location
    { wch: 10 }, // Status
    { wch: 12 }, // Default Shift
    { wch: 12 }, // Basic Salary
    { wch: 30 }, // Address
    { wch: 15 }, // Phone 1
    { wch: 15 }, // Phone 2
    { wch: 18 }, // Reference
    { wch: 14 }, // Entry Date
    { wch: 18 }, // Exit Date
    { wch: 30 }, // Notes
  ];

  worksheet["!pageSetup"] = {
    orientation: "landscape",
    fitToWidth: 1,
    fitToHeight: 0,
  };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Employees-${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}
