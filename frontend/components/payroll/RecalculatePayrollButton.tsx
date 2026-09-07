"use client";

import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRecalculatePayroll } from "@/hooks/payroll/usePayroll";

export default function RecalculatePayrollButton({
  payrollId,
}: {
  payrollId: string;
}) {
  const mutation = useRecalculatePayroll();
  return (
    <button
      type="button"
      onClick={() =>
        mutation.mutate(payrollId, {
          onSuccess: () => toast.success("Payroll recalculated."),
          onError: (error) => toast.error(error.message),
        })
      }
      disabled={mutation.isPending}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
    >
      <RefreshCw
        className={`h-4 w-4 ${mutation.isPending ? "animate-spin" : ""}`}
      />
      Recalculate
    </button>
  );
}
