"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
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
    <Button
      variant="secondary"
      onClick={handleExport}
      loading={isExporting}
      disabled={deductions.length === 0}
    >
      {!isExporting && <Download />}
      <span className="truncate">
        {isExporting ? "Exporting..." : "Export Excel"}
      </span>
    </Button>
  );
}
