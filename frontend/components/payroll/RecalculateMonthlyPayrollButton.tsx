"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useRecalculateMonthlyPayroll } from "@/hooks/payroll/usePayroll";

export default function RecalculateMonthlyPayrollButton({
  year,
  month,
}: {
  year?: number;
  month?: number;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = useRecalculateMonthlyPayroll();

  const targetYear = year ?? new Date().getFullYear();
  const targetMonth = month ?? new Date().getMonth() + 1;

  const monthName = new Date(2000, targetMonth - 1).toLocaleString("en", {
    month: "long",
  });

  const handleRecalculate = () => {
    mutation.mutate(
      {
        year: targetYear,
        month: targetMonth,
      },
      {
        onSuccess: (response) => {
          setConfirmOpen(false);
          const { recalculated, failed, total } = response.data;

          if (failed > 0) {
            toast.warning(
              `${recalculated} of ${total} payrolls recalculated. ${failed} failed.`,
            );
          } else if (total === 0) {
            toast.info("No draft payrolls found to recalculate.");
          } else {
            toast.success(
              `${recalculated} payrolls recalculated successfully.`,
            );
          }
        },
        onError: (error) => {
          setConfirmOpen(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setConfirmOpen(true)}
        disabled={mutation.isPending}
      >
        <RefreshCw className={mutation.isPending ? "animate-spin" : undefined} />
        {mutation.isPending ? "Recalculating..." : "Recalculate All"}
      </Button>

      <ConfirmationModal
        open={confirmOpen}
        title="Recalculate Monthly Payroll"
        description={`Are you sure you want to recalculate all draft payrolls for ${monthName} ${targetYear}? This will update calculations for all draft records.`}
        confirmText="Recalculate All"
        isLoading={mutation.isPending}
        onConfirm={handleRecalculate}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
