import type { ILocation } from "@/types/location";

interface ExportLocationsExcelOptions {
  locations: ILocation[];
}

const COLORS = {
  primary: "1E3A8A",
  primaryLight: "DBEAFE",
  border: "CBD5E1",
  text: "0F172A",
  muted: "64748B",
  white: "FFFFFF",
  background: "F8FAFC",
  alternate: "F8FAFC",
};

export async function exportLocationsExcel({
  locations,
}: ExportLocationsExcelOptions): Promise<void> {
  const ExcelJS = await import("exceljs");
  const { saveAs } = await import("file-saver");

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Baidar Security Services";
  workbook.lastModifiedBy = "Baidar Security Services";
  workbook.created = new Date();
  workbook.modified = new Date();

  // ============================================================
  // WORKSHEET
  // ============================================================

  const worksheet = workbook.addWorksheet("Locations");

  worksheet.views = [
    {
      showGridLines: false,
    },
  ];

  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: "landscape",
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

  // ============================================================
  // GROUP BY SECTOR
  // ============================================================

  const grouped = locations.reduce(
    (acc, location) => {
      const sectorId = location.sector._id;

      if (!acc[sectorId]) {
        acc[sectorId] = [];
      }

      acc[sectorId].push(location);

      return acc;
    },
    {} as Record<string, ILocation[]>,
  );

  const sectors = Object.keys(grouped).sort();

  sectors.forEach((sector) => {
    grouped[sector].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  });

  // ============================================================
  // COLUMN WIDTHS
  // ============================================================

  worksheet.getColumn(1).width = 7;

  sectors.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = 30;
  });

  // ============================================================
  // TITLE
  // ============================================================

  const lastColumn = sectors.length + 1;
  const lastColumnLetter = worksheet.getColumn(lastColumn).letter;

  worksheet.mergeCells(`A1:${lastColumnLetter}1`);

  const titleCell = worksheet.getCell("A1");

  titleCell.value = "LOCATION DIRECTORY";

  titleCell.font = {
    name: "Arial",
    size: 16,
    bold: true,
    color: {
      argb: COLORS.white,
    },
  };

  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: COLORS.primary,
    },
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  titleCell.border = {
    bottom: {
      style: "medium",
      color: {
        argb: COLORS.primary,
      },
    },
  };

  worksheet.getRow(1).height = 30;

  // ============================================================
  // GENERATED DATE
  // ============================================================

  worksheet.mergeCells(`A2:${lastColumnLetter}2`);

  const dateCell = worksheet.getCell("A2");

  dateCell.value = `Generated On: ${new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;

  dateCell.font = {
    name: "Arial",
    size: 9,
    italic: true,
    color: {
      argb: COLORS.muted,
    },
  };

  dateCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(2).height = 18;

  // ============================================================
  // HEADER
  // ============================================================

  const headerRow = worksheet.getRow(4);

  headerRow.getCell(1).value = "#";

  sectors.forEach((sector, index) => {
    headerRow.getCell(index + 2).value =
      grouped[sector][0]?.sector.name ?? "Unknown Sector";
  });

  headerRow.height = 24;

  for (let column = 1; column <= lastColumn; column++) {
    const cell = headerRow.getCell(column);

    cell.font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: {
        argb: COLORS.white,
      },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: COLORS.primary,
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
          argb: COLORS.border,
        },
      },
      bottom: {
        style: "thin",
        color: {
          argb: COLORS.border,
        },
      },
      left: {
        style: "thin",
        color: {
          argb: COLORS.border,
        },
      },
      right: {
        style: "thin",
        color: {
          argb: COLORS.border,
        },
      },
    };
  }

  // ============================================================
  // DATA
  // ============================================================

  const maxRows = Math.max(
    ...sectors.map((sector) => grouped[sector].length),
    0,
  );

  for (let i = 0; i < maxRows; i++) {
    const rowNumber = i + 5;
    const row = worksheet.getRow(rowNumber);

    row.getCell(1).value = i + 1;

    sectors.forEach((sector, index) => {
      row.getCell(index + 2).value = grouped[sector][i]?.name ?? "";
    });

    row.height = 21;

    for (let column = 1; column <= lastColumn; column++) {
      const cell = row.getCell(column);

      cell.font = {
        name: "Arial",
        size: 9,
        color: {
          argb: COLORS.text,
        },
      };

      cell.alignment = {
        horizontal: column === 1 ? "center" : "left",
        vertical: "middle",
        wrapText: true,
      };

      if (i % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: COLORS.alternate,
          },
        };
      }

      cell.border = {
        bottom: {
          style: "hair",
          color: {
            argb: COLORS.border,
          },
        },
        left: {
          style: "hair",
          color: {
            argb: COLORS.border,
          },
        },
        right: {
          style: "hair",
          color: {
            argb: COLORS.border,
          },
        },
      };
    }

    // Number styling
    row.getCell(1).font = {
      name: "Arial",
      size: 9,
      bold: true,
      color: {
        argb: COLORS.muted,
      },
    };
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (locations.length === 0) {
    const row = worksheet.getRow(5);

    worksheet.mergeCells(`A5:${lastColumnLetter}5`);

    const cell = row.getCell(1);

    cell.value = "No locations available.";

    cell.font = {
      name: "Arial",
      size: 10,
      italic: true,
      color: {
        argb: COLORS.muted,
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.height = 24;
  }

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
  // PRINT SETTINGS
  // ============================================================

  worksheet.pageSetup.horizontalDpi = 300;
  worksheet.pageSetup.verticalDpi = 300;

  // ============================================================
  // EXPORT
  // ============================================================

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Locations-${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}
