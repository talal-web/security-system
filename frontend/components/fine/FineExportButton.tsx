"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { exportFinesToExcel } from "@/utils/export/fine/fineExport";

import type { Fine, FineFilters } from "@/types/fine";

interface FineExportButtonProps {
  fines: Fine[];
  filters: FineFilters;
}

export default function FineExportButton({
  fines,
  filters,
}: FineExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!fines.length) {
      toast.info("No fine records available to export.");
      return;
    }

    try {
      setIsExporting(true);
      await exportFinesToExcel(fines, filters);
      toast.success("Fine report exported successfully.");
    } catch (error) {
      console.error("Fine export error:", error);
      toast.error("Failed to export fine report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || fines.length === 0}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export Excel"}
    </button>
  );
}
