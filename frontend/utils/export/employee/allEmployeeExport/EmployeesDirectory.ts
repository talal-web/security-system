import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import {
  formatDate,
  formatText,
  calculateAge,
} from "../../../employee/employeeFormat";

import { imageUrlToBase64 } from "../bioDataForm/employeeExcelImages";

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
  // LOAD IMAGES (profile + CNIC) FOR ALL EMPLOYEES UP FRONT
  // =========================================================

  const employeeImages = await Promise.all(
    employees.map(async (employee) => ({
      profile: await imageUrlToBase64(employee.profileImage),
      cnicFront: await imageUrlToBase64(employee.cnicFrontImage),
      cnicBack: await imageUrlToBase64(employee.cnicBackImage),
    })),
  );

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

  worksheet.mergeCells("A1:U1");

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

  worksheet.mergeCells("A2:U2");

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

  worksheet.mergeCells("A3:U3");

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

  worksheet.mergeCells("F4:U4");

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
    "Photo",
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
    "Emergency Contacts",
    "References",
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
      "", // Photo (embedded as an image below)
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
      (employee.emergencyContacts ?? [])
        .map((contact) =>
          [
            contact.name,
            contact.relation,
            contact.contact,
            contact.address,
            contact.isPrimary ? "Primary" : "",
          ]
            .filter(Boolean)
            .join(" / "),
        )
        .filter(Boolean)
        .join("; ") || "-",
      (employee.references ?? [])
        .map((reference) =>
          [reference.name, reference.relation, reference.contact, reference.address]
            .filter(Boolean)
            .join(" / "),
        )
        .filter(Boolean)
        .join("; ") || "-",
      formatDate(employee.entryDate),
      employee.exitDate ? formatDate(employee.exitDate) : "Currently Working",
      employee.notes || "-",
    ]);

    row.height = 56;

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
    // PHOTO
    // =======================================================

    const { profile } = employeeImages[index];

    if (profile) {
      const profileImageId = workbook.addImage({
        base64: profile.base64,
        extension: profile.extension,
      });

      worksheet.addImage(profileImageId, {
        tl: {
          col: 2.1,
          row: row.number - 1 + 0.1,
        },
        ext: {
          width: 42,
          height: 50,
        },
      });
    }

    // =======================================================
    // ALIGNMENT
    // =======================================================

    for (const column of [1, 2, 3, 6, 8, 13, 14]) {
      row.getCell(column).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }

    for (const column of [7, 19, 20]) {
      row.getCell(column).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    }

    // Long text
    for (const column of [15, 21]) {
      row.getCell(column).alignment = {
        vertical: "middle",
        wrapText: true,
      };
    }

    // =======================================================
    // STATUS
    // =======================================================

    const employeeStatus = row.getCell(13);

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
    { key: "photo", width: 8 },
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
    { key: "emergencyContacts", width: 30 },
    { key: "references", width: 30 },
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
    to: `U${lastRow}`,
  };

  // =========================================================
  // PRINT AREA
  // =========================================================

  worksheet.pageSetup.printArea = `A1:U${lastRow}`;

  // =========================================================
  // CNIC IMAGES SHEET (one section per employee with any CNIC image)
  // =========================================================

  const employeesWithCnic = employees
    .map((employee, index) => ({ employee, images: employeeImages[index] }))
    .filter(({ images }) => images.cnicFront || images.cnicBack);

  if (employeesWithCnic.length > 0) {
    const cnicSheet = workbook.addWorksheet("CNIC Images");

    cnicSheet.views = [
      {
        showGridLines: false,
      },
    ];

    cnicSheet.columns = [
      { width: 5 },
      { width: 35 },
      { width: 35 },
      { width: 5 },
    ];

    let currentRow = 1;

    for (const { employee, images } of employeesWithCnic) {
      cnicSheet.mergeCells(`A${currentRow}:D${currentRow}`);

      const sectionTitle = cnicSheet.getCell(`A${currentRow}`);

      sectionTitle.value = `${employee.empId || "-"} - ${formatText(employee.name)} - CNIC`;

      sectionTitle.font = {
        name: "Arial",
        size: 14,
        bold: true,
        color: {
          argb: WHITE,
        },
      };

      sectionTitle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: PRIMARY,
        },
      };

      sectionTitle.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cnicSheet.getRow(currentRow).height = 26;

      currentRow += 2;

      if (images.cnicFront) {
        cnicSheet.mergeCells(`B${currentRow}:C${currentRow}`);

        const frontLabel = cnicSheet.getCell(`B${currentRow}`);

        frontLabel.value = "CNIC FRONT";

        frontLabel.font = {
          name: "Arial",
          size: 10,
          bold: true,
          color: {
            argb: SLATE_700,
          },
        };

        frontLabel.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        const frontImageId = workbook.addImage({
          base64: images.cnicFront.base64,
          extension: images.cnicFront.extension,
        });

        cnicSheet.addImage(frontImageId, {
          tl: {
            col: 1.15,
            row: currentRow + 0.5,
          },
          ext: {
            width: 500,
            height: 300,
          },
        });

        currentRow += 16;
      }

      if (images.cnicBack) {
        cnicSheet.mergeCells(`B${currentRow}:C${currentRow}`);

        const backLabel = cnicSheet.getCell(`B${currentRow}`);

        backLabel.value = "CNIC BACK";

        backLabel.font = {
          name: "Arial",
          size: 10,
          bold: true,
          color: {
            argb: SLATE_700,
          },
        };

        backLabel.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        const backImageId = workbook.addImage({
          base64: images.cnicBack.base64,
          extension: images.cnicBack.extension,
        });

        cnicSheet.addImage(backImageId, {
          tl: {
            col: 1.15,
            row: currentRow + 0.5,
          },
          ext: {
            width: 500,
            height: 300,
          },
        });

        currentRow += 16;
      }

      currentRow += 2;
    }
  }

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
