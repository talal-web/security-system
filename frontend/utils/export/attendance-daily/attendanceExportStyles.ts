import type { Cell, Row, Worksheet } from "exceljs";

export const ATTENDANCE_EXPORT_COLORS = {
  primary: "1F4E78",
  primaryLight: "D9EAF7",
  header: "1F4E78",
  headerText: "FFFFFF",
  location: "D9E2F3",
  locationText: "17365D",
  border: "B7C9D6",
  present: "E2F0D9",
  presentText: "375623",
  absent: "FCE4D6",
  absentText: "9C0006",
  leave: "FFF2CC",
  leaveText: "7F6000",
  day: "FFF2CC",
  dayText: "7F6000",
  night: "D9E1F2",
  nightText: "1F3864",
  white: "FFFFFF",
  text: "222222",
  muted: "666666",
};

export const setCellBorder = (cell: Cell) => {
  cell.border = {
    top: {
      style: "thin",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
    left: {
      style: "thin",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
    bottom: {
      style: "thin",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
    right: {
      style: "thin",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
  };
};

export const setRowBorder = (row: Row) => {
  row.eachCell((cell: Cell) => setCellBorder(cell));
};

export const applyDefaultWorksheetFont = (worksheet: Worksheet) => {
  worksheet.eachRow((row: Row) => {
    row.font = {
      name: "Calibri",
      size: 11,
      color: {
        argb: ATTENDANCE_EXPORT_COLORS.text,
      },
    };
  });
};

export const applyHeaderStyle = (row: Row) => {
  row.height = 24;
  row.font = {
    bold: true,
    color: {
      argb: ATTENDANCE_EXPORT_COLORS.headerText,
    },
  };
  row.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: ATTENDANCE_EXPORT_COLORS.header,
    },
  };
  setRowBorder(row);
};

export const applyLocationStyle = (row: Row) => {
  row.height = 24;
  row.font = {
    bold: true,
    size: 12,
    color: {
      argb: ATTENDANCE_EXPORT_COLORS.locationText,
    },
  };
  row.alignment = {
    horizontal: "left",
    vertical: "middle",
  };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: ATTENDANCE_EXPORT_COLORS.location,
    },
  };
  row.getCell(1).border = {
    top: {
      style: "medium",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
    bottom: {
      style: "thin",
      color: { argb: ATTENDANCE_EXPORT_COLORS.border },
    },
  };
};

export const applyStatusCellStyle = (cell: Cell, status?: string) => {
  if (status === "present") {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.present },
    };
    cell.font = {
      bold: true,
      color: { argb: ATTENDANCE_EXPORT_COLORS.presentText },
    };
    return;
  }

  if (status === "absent") {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.absent },
    };
    cell.font = {
      bold: true,
      color: { argb: ATTENDANCE_EXPORT_COLORS.absentText },
    };
    return;
  }

  if (status === "leave") {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.leave },
    };
    cell.font = {
      bold: true,
      color: { argb: ATTENDANCE_EXPORT_COLORS.leaveText },
    };
  }
};

export const applyShiftCellStyle = (cell: Cell, shift?: string) => {
  if (shift === "day") {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.day },
    };
    cell.font = {
      bold: true,
      color: { argb: ATTENDANCE_EXPORT_COLORS.dayText },
    };
    return;
  }

  if (shift === "night") {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: ATTENDANCE_EXPORT_COLORS.night },
    };
    cell.font = {
      bold: true,
      color: { argb: ATTENDANCE_EXPORT_COLORS.nightText },
    };
  }
};
