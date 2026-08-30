"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { exportAdvancesToExcel } from "@/utils/export/advance/AdvanceExport";

import type { Advance, AdvanceFilters } from "@/types/advance";

interface AdvanceExportButtonProps {
  advances: Advance[];
  filters: AdvanceFilters;
}

export default function AdvanceExportButton({
  advances,
  filters,
}: AdvanceExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!advances.length) {
      toast.info("No advance records available to export.");
      return;
    }

    try {
      setIsExporting(true);

      await exportAdvancesToExcel(advances, filters);

      toast.success("Advance report exported successfully.");
    } catch (error) {
      console.error("Advance export error:", error);

      toast.error("Failed to export advance report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || advances.length === 0}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
