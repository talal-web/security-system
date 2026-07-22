import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

import type { ILocation } from "@/types/location";
import { formatSectorName } from "../formatSectorName";

interface ExportLocationsExcelOptions {
  locations: ILocation[];
}

export async function exportLocationsExcel({
  locations,
}: ExportLocationsExcelOptions) {
  const workbook = XLSX.utils.book_new();

  const rows: (string | number)[][] = [];

  // ======================================
  // TITLE
  // ======================================

  rows.push(["LOCATION DIRECTORY"]);
  rows.push([]);

  // ======================================
  // GROUP BY SECTOR
  // ======================================

  const grouped = locations.reduce(
    (acc, location) => {
      if (!acc[location.sector]) {
        acc[location.sector] = [];
      }

      acc[location.sector].push(location);

      return acc;
    },
    {} as Record<string, ILocation[]>,
  );

  const sectors = Object.keys(grouped).sort();

  sectors.forEach((sector) => {
    grouped[sector].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  });

  // ======================================
  // HEADER
  // ======================================

  rows.push(["#", ...sectors.map((sector) => formatSectorName(sector))]);

  const maxRows = Math.max(
    ...sectors.map((sector) => grouped[sector].length),
    0,
  );

  // ======================================
  // DATA
  // ======================================

  for (let i = 0; i < maxRows; i++) {
    const row: (string | number)[] = [i + 1];

    sectors.forEach((sector) => {
      row.push(grouped[sector][i]?.name ?? "");
    });

    rows.push(row);
  }

  // ======================================
  // SHEET
  // ======================================

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 6 }, // #
    ...sectors.map(() => ({
      wch: 30,
    })),
  ];

  worksheet["!pageSetup"] = {
    orientation: "landscape",
    fitToWidth: 1,
    fitToHeight: 0,
  };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Locations-${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}
