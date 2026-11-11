"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { exportPayrollsToExcel } from "@/utils/export/payroll/PayrollExport";
import type { Payroll, PayrollFilters } from "@/types/payroll";

export default function PayrollExportButton({
  payrolls,
  filters,
}: {
  payrolls: Payroll[];
  filters: PayrollFilters;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!payrolls.length) {
      toast.info("No payroll records available to export.");
      return;
    }

    try {
      setIsExporting(true);
      await exportPayrollsToExcel(payrolls, filters);
      toast.success("Payroll report exported successfully.");
    } catch (error) {
      console.error("Payroll export error:", error);
      toast.error("Failed to export payroll report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={isExporting || !payrolls.length}
    >
      {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
      {isExporting ? "Exporting..." : "Export Excel"}
    </Button>
  );
}
