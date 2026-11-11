"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
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
    <Button
      variant="secondary"
      onClick={handleExport}
      loading={isExporting}
      disabled={advances.length === 0}
    >
      {!isExporting && <Download />}
      {isExporting ? "Exporting..." : "Export Excel"}
    </Button>
  );
}
