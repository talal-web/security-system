import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import {
  formatDate,
  formatText,
  calculateAge,
} from "../../../employee/employeeFormat";

import type { Employee } from "@/types/employee";

interface ExportEmployeesDirectoryOptions {
  employees: Employee[];
  title?: string;
}

export async function exportEmployeesDirectory({
  employees,
  title = "Employees Directory",
}: ExportEmployeesDirectoryOptions): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Baidar Security Services";
  workbook.lastModifiedBy = "Baidar Security Services";
  workbook.created = new Date();
  workbook.modified = new Date();

  // =========================================================
  // COLORS
  // =========================================================

  const PRIMARY = "2563EB";
  const PRIMARY_DARK = "1E40AF";

  const SLATE_50 = "F8FAFC";
  const SLATE_100 = "F1F5F9";
  const SLATE_200 = "E2E8F0";
  const SLATE_500 = "64748B";
  const SLATE_700 = "334155";
  const SLATE_900 = "0F172A";

  const WHITE = "FFFFFF";

  const GREEN = "16A34A";
  const GREEN_LIGHT = "DCFCE7";

  const RED = "DC2626";
  const RED_LIGHT = "FEE2E2";

  const BLUE_LIGHT = "DBEAFE";

  // =========================================================
  // WORKSHEET
  // =========================================================

  const worksheet = workbook.addWorksheet("Employees", {
    views: [
      {
        state: "frozen",
        ySplit: 6,
      },
    ],
  });

  // =========================================================
  // PAGE SETUP
  // =========================================================

  worksheet.pageSetup.orientation = "landscape";
  worksheet.pageSetup.paperSize = 9;
  worksheet.pageSetup.fitToPage = true;
  worksheet.pageSetup.fitToWidth = 1;
  worksheet.pageSetup.fitToHeight = 0;

  // IMPORTANT:
  // pageMargins is not a worksheet property in your ExcelJS typings.
  // Configure it through pageSetup instead.
  worksheet.pageSetup.margins = {
    left: 0.3,
    right: 0.3,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };

  worksheet.pageSetup.printTitlesRow = "1:6";

  // =========================================================
  // HEADER / FOOTER
  // =========================================================

  worksheet.headerFooter.oddFooter =
    "&LGenerated: &D&CBAIDAR SECURITY SERVICES&RPage &P of &N";

  // =========================================================
  // TITLE
  // =========================================================

  worksheet.mergeCells("A1:T1");

  const titleCell = worksheet.getCell("A1");

  titleCell.value = "BAIDAR SECURITY SERVICES";

  titleCell.font = {
    name: "Calibri",
    bold: true,
    size: 18,
    color: {
      argb: WHITE,
    },
  };

  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: PRIMARY,
    },
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 32;

  // =========================================================
  // REPORT TITLE
  // =========================================================

  worksheet.mergeCells("A2:T2");

  const reportTitleCell = worksheet.getCell("A2");

  reportTitleCell.value = title.toUpperCase();

  reportTitleCell.font = {
    name: "Calibri",
    bold: true,
    size: 14,
    color: {
      argb: SLATE_900,
    },
  };

  reportTitleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).height = 25;

  // =========================================================
  // REPORT INFO
  // =========================================================

  worksheet.mergeCells("A3:T3");

  const generatedCell = worksheet.getCell("A3");

  generatedCell.value = `Generated On: ${formatDate(new Date().toISOString())}`;

  generatedCell.font = {
    name: "Calibri",
    size: 10,
    italic: true,
    color: {
      argb: SLATE_500,
    },
  };

  generatedCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(3).height = 18;

  // =========================================================
  // SUMMARY
  // =========================================================

  worksheet.mergeCells("A4:E4");

  const totalCell = worksheet.getCell("A4");

  totalCell.value = `Total Employees: ${employees.length}`;

  totalCell.font = {
    name: "Calibri",
    bold: true,
    size: 10,
    color: {
      argb: SLATE_700,
    },
  };

  totalCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: BLUE_LIGHT,
    },
  };

  totalCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells("F4:T4");

  const activeCount = employees.filter(
    (employee) => employee.status === "active",
  ).length;

  const inactiveCount = employees.length - activeCount;

  const statusCell = worksheet.getCell("F4");

  statusCell.value = `Active: ${activeCount}   |   Inactive: ${inactiveCount}`;

  statusCell.font = {
    name: "Calibri",
    bold: true,
    size: 10,
    color: {
      argb: SLATE_700,
    },
  };

  statusCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: SLATE_100,
    },
  };

  statusCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(4).height = 23;

  // =========================================================
  // SPACING
  // =========================================================

  worksheet.getRow(5).height = 8;

  // =========================================================
  // TABLE HEADER
  // =========================================================

  const headers = [
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
    "Address",
    "Phone 1",
    "Phone 2",
    "Reference",
    "Entry Date",
    "Exit Date",
    "Notes",
  ];

  const headerRow = worksheet.getRow(6);

  headerRow.values = headers;

  headerRow.height = 30;

  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Calibri",
      bold: true,
      size: 9,
      color: {
        argb: WHITE,
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: PRIMARY_DARK,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = {
      top: {
        style: "thin",
        color: {
          argb: WHITE,
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: WHITE,
        },
      },
      left: {
        style: "thin",
        color: {
          argb: WHITE,
        },
      },
      right: {
        style: "thin",
        color: {
          argb: WHITE,
        },
      },
    };
  });

  // =========================================================
  // DATA
  // =========================================================

  employees.forEach((employee, index) => {
    const location =
      typeof employee.currentLocation === "string"
        ? employee.currentLocation
        : (employee.currentLocation?.name ?? "-");

    const age =
      typeof employee.age === "number"
        ? employee.age
        : calculateAge(employee.birthDate);

    const row = worksheet.addRow([
      index + 1,
      employee.empId || "-",
      formatText(employee.name),
      formatText(employee.fatherName),
      employee.cnic || "-",
      formatDate(employee.birthDate),
      age,
      employee.education ? formatText(employee.education) : "-",
      formatText(employee.designation),

      // Sector name
      typeof employee.sector === "string" ? "-" : employee.sector?.name || "-",

      // Current location name
      location || "-",

      formatText(employee.status),
      employee.defaultShift ? formatText(employee.defaultShift) : "-",
      employee.address || "-",
      employee.phone1 || "-",
      employee.phone2 || "-",
      employee.reference || "-",
      formatDate(employee.entryDate),
      employee.exitDate ? formatDate(employee.exitDate) : "Currently Working",
      employee.notes || "-",
    ]);

    row.height = 24;

    // Alternating rows
    if (index % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: SLATE_50,
          },
        };
      });
    }

    row.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        size: 9,
        color: {
          argb: SLATE_900,
        },
      };

      cell.alignment = {
        vertical: "middle",
      };

      cell.border = {
        top: {
          style: "thin",
          color: {
            argb: SLATE_200,
          },
        },
        bottom: {
          style: "thin",
          color: {
            argb: SLATE_200,
          },
        },
        left: {
          style: "thin",
          color: {
            argb: SLATE_200,
          },
        },
        right: {
          style: "thin",
          color: {
            argb: SLATE_200,
          },
        },
      };
    });

    // =======================================================
    // ALIGNMENT
    // =======================================================

    for (const column of [1, 2, 5, 7, 12, 13]) {
      row.getCell(column).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }

    for (const column of [6, 18, 19]) {
      row.getCell(column).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }

    // Long text
    for (const column of [14, 20]) {
      row.getCell(column).alignment = {
        vertical: "middle",
        wrapText: true,
      };
    }

    // =======================================================
    // STATUS
    // =======================================================

    const employeeStatus = row.getCell(12);

    employeeStatus.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    if (employee.status === "active") {
      employeeStatus.font = {
        name: "Calibri",
        bold: true,
        size: 9,
        color: {
          argb: GREEN,
        },
      };

      employeeStatus.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: GREEN_LIGHT,
        },
      };
    } else {
      employeeStatus.font = {
        name: "Calibri",
        bold: true,
        size: 9,
        color: {
          argb: RED,
        },
      };

      employeeStatus.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: RED_LIGHT,
        },
      };
    }
  });

  // =========================================================
  // COLUMN WIDTHS
  // =========================================================

  worksheet.columns = [
    { key: "number", width: 5 },
    { key: "employeeId", width: 12 },
    { key: "name", width: 23 },
    { key: "fatherName", width: 23 },
    { key: "cnic", width: 18 },
    { key: "birthDate", width: 14 },
    { key: "age", width: 7 },
    { key: "education", width: 13 },
    { key: "designation", width: 18 },
    { key: "sector", width: 16 },
    { key: "location", width: 21 },
    { key: "status", width: 12 },
    { key: "defaultShift", width: 13 },
    { key: "address", width: 30 },
    { key: "phone1", width: 16 },
    { key: "phone2", width: 16 },
    { key: "reference", width: 18 },
    { key: "entryDate", width: 14 },
    { key: "exitDate", width: 18 },
    { key: "notes", width: 30 },
  ];

  // =========================================================
  // AUTO FILTER
  // =========================================================

  const lastRow = Math.max(6, 6 + employees.length);

  worksheet.autoFilter = {
    from: "A6",
    to: `T${lastRow}`,
  };

  // =========================================================
  // PRINT AREA
  // =========================================================

  worksheet.pageSetup.printArea = `A1:T${lastRow}`;

  // =========================================================
  // FILE
  // =========================================================

  const date = new Date().toISOString().split("T")[0];

  const fileName = `Employees-${date}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
}
