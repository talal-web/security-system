"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || !payrolls.length}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
