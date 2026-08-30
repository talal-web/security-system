"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { exportDeductionsToExcel } from "@/utils/export/deduction/DeductionExport";

import type { Deduction, DeductionFilters } from "@/types/deduction";

interface DeductionExportButtonProps {
  deductions: Deduction[];
  filters: DeductionFilters;
}

export default function DeductionExportButton({
  deductions,
  filters,
}: DeductionExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!deductions.length) {
      toast.info("No deduction records available to export.");
      return;
    }

    try {
      setIsExporting(true);

      await exportDeductionsToExcel(deductions, filters);

      toast.success("Deduction report exported successfully.");
    } catch (error) {
      console.error("Deduction export error:", error);

      toast.error("Failed to export deduction report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || deductions.length === 0}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-xl sm:px-4 sm:text-sm"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <Download className="h-4 w-4 shrink-0" />
      )}

      <span className="truncate">
        {isExporting ? "Exporting..." : "Export Excel"}
      </span>
    </button>
  );
}
