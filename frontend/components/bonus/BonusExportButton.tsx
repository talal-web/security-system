"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
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
    <Button
      variant="secondary"
      onClick={handleExport}
      loading={isExporting}
      disabled={bonuses.length === 0}
    >
      {!isExporting && <Download />}
      <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
    </Button>
  );
}
