import {
  formatDate,
  formatText,
  calculateAge,
} from "../employee/employeeFormat";
import { formatSectorName } from "../formatSectorName";

import type { Employee } from "@/types/employee";

interface ExportEmployeeBioDataOptions {
  employee: Employee;
  title?: string;
}

export async function exportEmployeeBioData({
  employee,
  title = "Employee Bio Data",
}: ExportEmployeeBioDataOptions): Promise<void> {
  const XLSX = await import("xlsx");
  const { saveAs } = await import("file-saver");

  const worksheet = XLSX.utils.aoa_to_sheet([]);

  const location =
    typeof employee.currentLocation === "string"
      ? employee.currentLocation
      : (employee.currentLocation?.name ?? "-");

  const rows = [
    ["BAIDAR SECURITY SERVICES"],
    ["EMPLOYEE BIO DATA FORM"],
    [],
    ["Generated On", formatDate(new Date().toISOString())],
    [],

    ["PERSONAL INFORMATION"],
    ["Employee ID", employee.empId],
    ["Employee Name", formatText(employee.name)],
    ["Father Name", formatText(employee.fatherName)],
    ["CNIC", employee.cnic],
    ["Date of Birth", formatDate(employee.birthDate)],
    ["Age", `${calculateAge(employee.birthDate)} Years`],
    ["Education", formatText(employee.education ?? undefined)],
    ["Reference", formatText(employee.reference)],
    [],

    ["CONTACT INFORMATION"],
    ["Address", formatText(employee.address)],
    ["Primary Phone", employee.phone1],
    ["Secondary Phone", employee.phone2 || "-"],
    [],

    ["EMPLOYMENT INFORMATION"],
    ["Designation", formatText(employee.designation)],
    ["Current Location", location],
    ["Sector", employee.sector ? formatSectorName(employee.sector) : "-"],
    [
      "Basic Salary",
      employee.basicSalary
        ? `Rs. ${employee.basicSalary.toLocaleString()}`
        : "-",
    ],
    ["Status", formatText(employee.status)],
    ["Entry Date", formatDate(employee.entryDate)],
    [
      "Exit Date",
      employee.exitDate ? formatDate(employee.exitDate) : "Currently Working",
    ],
    [],

    ["ADDITIONAL NOTES"],
    [employee.notes || "No Notes"],
  ];

  XLSX.utils.sheet_add_aoa(worksheet, rows, {
    origin: "A1",
  });

  worksheet["!cols"] = [{ wch: 28 }, { wch: 45 }];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Bio Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `${employee.empId || "Employee"} - Bio Data.xlsx`,
  );
}
