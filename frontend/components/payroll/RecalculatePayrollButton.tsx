"use client";

import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useRecalculatePayroll } from "@/hooks/payroll/usePayroll";

export default function RecalculatePayrollButton({
  payrollId,
}: {
  payrollId: string;
}) {
  const mutation = useRecalculatePayroll();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() =>
        mutation.mutate(payrollId, {
          onSuccess: () => toast.success("Payroll recalculated."),
          onError: (error) => toast.error(error.message),
        })
      }
      disabled={mutation.isPending}
    >
      <RefreshCw className={mutation.isPending ? "animate-spin" : undefined} />
      Recalculate
    </Button>
  );
}
