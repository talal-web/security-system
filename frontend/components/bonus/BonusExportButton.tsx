"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { exportBonusesToExcel } from "@/utils/export/bonus/bonusExport";

import type { Bonus, BonusFilters } from "@/types/bonus";

interface BonusExportButtonProps {
  bonuses: Bonus[];
  filters: BonusFilters;
}

export default function BonusExportButton({
  bonuses,
  filters,
}: BonusExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!bonuses.length) {
      toast.info("No bonus records available to export.");
      return;
    }

    try {
      setIsExporting(true);

      await exportBonusesToExcel(bonuses, filters);

      toast.success("Bonus report exported successfully.");
    } catch (error) {
      console.error("Bonus export error:", error);

      toast.error("Failed to export bonus report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || bonuses.length === 0}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}

      <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
    </button>
  );
}
