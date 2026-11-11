"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
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
    <Button
      variant="secondary"
      onClick={handleExport}
      loading={isExporting}
      disabled={fines.length === 0}
    >
      {!isExporting && <Download />}
      {isExporting ? "Exporting..." : "Export Excel"}
    </Button>
  );
}
