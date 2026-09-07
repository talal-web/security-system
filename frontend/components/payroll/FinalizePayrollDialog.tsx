"use client";

import { toast } from "sonner";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useFinalizePayroll } from "@/hooks/payroll/usePayroll";

export default function FinalizePayrollDialog({
  open,
  payrollId,
  onClose,
}: {
  open: boolean;
  payrollId: string;
  onClose: () => void;
}) {
  const mutation = useFinalizePayroll();
  const confirm = () =>
    mutation.mutate(payrollId, {
      onSuccess: () => {
        toast.success("Payroll finalized and source records updated.");
        onClose();
      },
      onError: (error) => toast.error(error.message),
    });
  return (
    <ConfirmationModal
      open={open}
      title="Finalize payroll"
      description="Finalizing applies the listed bonuses and deductions. This cannot be recalculated afterwards."
      confirmText="Finalize"
      isLoading={mutation.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  );
}
