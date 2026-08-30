import {
  formatDate,
  formatText,
  calculateAge,
} from "@/utils/employee/employeeFormat";
import { formatSectorName } from "@/utils/formatSectorName";

import type { Employee } from "@/types/employee";

import { addField, addSection } from "./EmployeeExcelHelpers";

import { imageUrlToBase64 } from "./employeeExcelImages";

import { EMPLOYEE_EXCEL_COLORS as COLORS } from "./EmployeeExcelStyles";

interface ExportEmployeeBioDataOptions {
  employee: Employee;
  title?: string;
}

export async function exportEmployeeBioData({
  employee,
  title = "Employee Bio Data",
}: ExportEmployeeBioDataOptions): Promise<void> {
  const ExcelJS = await import("exceljs");
  const { saveAs } = await import("file-saver");

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Baidar Security Services";
  workbook.lastModifiedBy = "Baidar Security Services";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Employee Bio Data");

  // ============================================================
  // PAGE SETUP
  // ============================================================

  worksheet.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.views = [
    {
      showGridLines: false,
    },
  ];

  // ============================================================
  // COLUMN WIDTHS
  // ============================================================

  worksheet.columns = [
    {
      key: "label",
      width: 25,
    },
    {
      key: "value",
      width: 42,
    },
    {
      key: "extra",
      width: 20,
    },
    {
      key: "photo",
      width: 18,
    },
  ];

  // ============================================================
  // EMPLOYEE DATA
  // ============================================================

  const location =
    typeof employee.currentLocation === "string"
      ? employee.currentLocation
      : (employee.currentLocation?.name ?? "-");

  const employeeAge = calculateAge(employee.birthDate);

  // ============================================================
  // HEADER
  // ============================================================

  worksheet.mergeCells("A1:D1");

  const companyCell = worksheet.getCell("A1");

  companyCell.value = "BAIDAR SECURITY SERVICES";

  companyCell.font = {
    name: "Arial",
    size: 18,
    bold: true,
    color: {
      argb: COLORS.white,
    },
  };

  companyCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: COLORS.primary,
    },
  };

  companyCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 32;

  // ============================================================
  // TITLE
  // ============================================================

  worksheet.mergeCells("A2:D2");

  const titleCell = worksheet.getCell("A2");

  titleCell.value = title.toUpperCase();

  titleCell.font = {
    name: "Arial",
    size: 13,
    bold: true,
    color: {
      argb: COLORS.primary,
    },
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).height = 24;

  // ============================================================
  // GENERATED DATE
  // ============================================================

  worksheet.mergeCells("A3:D3");

  const generatedCell = worksheet.getCell("A3");

  generatedCell.value = `Generated On: ${formatDate(new Date().toISOString())}`;

  generatedCell.font = {
    name: "Arial",
    size: 9,
    italic: true,
    color: {
      argb: COLORS.muted,
    },
  };

  generatedCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(3).height = 18;

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const profileImage = await imageUrlToBase64(employee.profileImage);

  if (profileImage) {
    const imageId = workbook.addImage({
      base64: profileImage.base64,
      extension: profileImage.extension,
    });

    worksheet.addImage(imageId, {
      tl: {
        col: 2.05,
        row: 3.5,
      },
      ext: {
        width: 130,
        height: 150,
      },
    });

    for (let row = 4; row <= 10; row++) {
      worksheet.getRow(row).height = 22;
    }
  }

  // ============================================================
  // PERSONAL INFORMATION
  // ============================================================

  let currentRow = 5;

  addSection(worksheet, currentRow, "PERSONAL INFORMATION");

  currentRow++;

  addField(worksheet, currentRow++, "Employee ID", employee.empId || "-");

  addField(worksheet, currentRow++, "Name", formatText(employee.name));

  addField(
    worksheet,
    currentRow++,
    "Father Name",
    formatText(employee.fatherName),
  );

  addField(worksheet, currentRow++, "CNIC", employee.cnic || "-");

  addField(
    worksheet,
    currentRow++,
    "Date of Birth",
    formatDate(employee.birthDate),
  );

  addField(worksheet, currentRow++, "Age", `${employeeAge} Years`);

  addField(
    worksheet,
    currentRow++,
    "Education",
    formatText(employee.education ?? undefined),
  );

  addField(
    worksheet,
    currentRow++,
    "Reference",
    formatText(employee.reference),
  );

  currentRow++;

  // ============================================================
  // CONTACT INFORMATION
  // ============================================================

  addSection(worksheet, currentRow, "CONTACT INFORMATION");

  currentRow++;

  addField(worksheet, currentRow++, "Address", formatText(employee.address));

  addField(worksheet, currentRow++, "Primary Phone", employee.phone1 || "-");

  addField(worksheet, currentRow++, "Secondary Phone", employee.phone2 || "-");

  currentRow++;

  // ============================================================
  // EMPLOYMENT INFORMATION
  // ============================================================

  addSection(worksheet, currentRow, "EMPLOYMENT INFORMATION");

  currentRow++;

  addField(
    worksheet,
    currentRow++,
    "Designation",
    formatText(employee.designation),
  );

  addField(worksheet, currentRow++, "Current Location", location);

  addField(
    worksheet,
    currentRow++,
    "Sector",
    employee.sector ? formatSectorName(employee.sector) : "-",
  );

  addField(worksheet, currentRow++, "Status", formatText(employee.status));

  addField(
    worksheet,
    currentRow++,
    "Entry Date",
    formatDate(employee.entryDate),
  );

  addField(
    worksheet,
    currentRow++,
    "Exit Date",
    employee.exitDate ? formatDate(employee.exitDate) : "Currently Working",
  );

  currentRow++;

  // ============================================================
  // ADDITIONAL NOTES
  // ============================================================

  addSection(worksheet, currentRow, "ADDITIONAL NOTES");

  currentRow++;

  addField(worksheet, currentRow, "Notes", employee.notes || "No Notes");

  // ============================================================
  // CNIC IMAGES
  // ============================================================

  const cnicFrontImage = await imageUrlToBase64(employee.cnicFrontImage);

  const cnicBackImage = await imageUrlToBase64(employee.cnicBackImage);

  if (cnicFrontImage || cnicBackImage) {
    const cnicSheet = workbook.addWorksheet("CNIC Images");

    cnicSheet.views = [
      {
        showGridLines: false,
      },
    ];

    cnicSheet.columns = [
      {
        width: 5,
      },
      {
        width: 35,
      },
      {
        width: 35,
      },
      {
        width: 5,
      },
    ];

    cnicSheet.mergeCells("A1:D1");

    const cnicTitle = cnicSheet.getCell("A1");

    cnicTitle.value = `${employee.empId || "Employee"} - CNIC`;

    cnicTitle.font = {
      name: "Arial",
      size: 16,
      bold: true,
      color: {
        argb: COLORS.white,
      },
    };

    cnicTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: COLORS.primary,
      },
    };

    cnicTitle.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cnicSheet.getRow(1).height = 30;

    // ----------------------------------------------------------
    // FRONT
    // ----------------------------------------------------------

    if (cnicFrontImage) {
      cnicSheet.mergeCells("B3:C3");

      const frontLabel = cnicSheet.getCell("B3");

      frontLabel.value = "CNIC FRONT";

      frontLabel.font = {
        name: "Arial",
        size: 11,
        bold: true,
        color: {
          argb: COLORS.text,
        },
      };

      frontLabel.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      const frontImageId = workbook.addImage({
        base64: cnicFrontImage.base64,
        extension: cnicFrontImage.extension,
      });

      cnicSheet.addImage(frontImageId, {
        tl: {
          col: 1.15,
          row: 3.5,
        },
        ext: {
          width: 500,
          height: 300,
        },
      });
    }

    // ----------------------------------------------------------
    // BACK
    // ----------------------------------------------------------

    if (cnicBackImage) {
      cnicSheet.mergeCells("B22:C22");

      const backLabel = cnicSheet.getCell("B22");

      backLabel.value = "CNIC BACK";

      backLabel.font = {
        name: "Arial",
        size: 11,
        bold: true,
        color: {
          argb: COLORS.text,
        },
      };

      backLabel.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      const backImageId = workbook.addImage({
        base64: cnicBackImage.base64,
        extension: cnicBackImage.extension,
      });

      cnicSheet.addImage(backImageId, {
        tl: {
          col: 1.15,
          row: 22.5,
        },
        ext: {
          width: 500,
          height: 300,
        },
      });
    }
  }

  // ============================================================
  // GLOBAL FORMATTING
  // ============================================================

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      if (!cell.font) {
        cell.font = {
          name: "Arial",
          size: 9,
        };
      }
    });
  });

  // ============================================================
  // FREEZE HEADER
  // ============================================================

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 4,
      showGridLines: false,
    },
  ];

  // ============================================================
  // EXPORT
  // ============================================================

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${employee.empId || "Employee"} - Bio Data.xlsx`,
  );
}
