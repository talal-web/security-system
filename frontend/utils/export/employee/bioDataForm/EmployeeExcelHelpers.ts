import type ExcelJS from "exceljs";

import { EMPLOYEE_EXCEL_COLORS as COLORS } from "./EmployeeExcelStyles";

export function addSection(
  worksheet: ExcelJS.Worksheet,
  rowNumber: number,
  heading: string,
): void {
  worksheet.mergeCells(`A${rowNumber}:D${rowNumber}`);

  const cell = worksheet.getCell(`A${rowNumber}`);

  cell.value = heading;

  cell.font = {
    name: "Arial",
    size: 10,
    bold: true,
    color: {
      argb: COLORS.text,
    },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: COLORS.section,
    },
  };

  cell.alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  cell.border = {
    top: {
      style: "thin",
      color: {
        argb: COLORS.border,
      },
    },
    bottom: {
      style: "thin",
      color: {
        argb: COLORS.border,
      },
    },
  };

  worksheet.getRow(rowNumber).height = 20;
}

export function addField(
  worksheet: ExcelJS.Worksheet,
  rowNumber: number,
  label: string,
  value: string | number,
): void {
  const row = worksheet.getRow(rowNumber);

  row.getCell(1).value = label;
  row.getCell(2).value = value;

  row.getCell(1).font = {
    name: "Arial",
    size: 9,
    bold: true,
    color: {
      argb: COLORS.muted,
    },
  };

  row.getCell(2).font = {
    name: "Arial",
    size: 9,
    color: {
      argb: COLORS.text,
    },
  };

  row.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: COLORS.background,
    },
  };

  row.getCell(1).alignment = {
    vertical: "middle",
  };

  row.getCell(2).alignment = {
    vertical: "middle",
    wrapText: true,
  };

  [1, 2].forEach((column) => {
    row.getCell(column).border = {
      bottom: {
        style: "hair",
        color: {
          argb: COLORS.border,
        },
      },
    };
  });

  row.height = 19;
}
