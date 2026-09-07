"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { useMarkPayrollAsPaid } from "@/hooks/payroll/usePayroll";
import type { PayrollPaymentMethod } from "@/types/payroll";

export default function MarkPayrollPaidDialog({
  open,
  payrollId,
  onClose,
}: {
  open: boolean;
  payrollId: string;
  onClose: () => void;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<PayrollPaymentMethod>("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const mutation = useMarkPayrollAsPaid();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!paymentReference.trim())
      return setError("Payment reference is required.");
    mutation.mutate(
      {
        payrollId,
        paymentData: {
          paymentMethod,
          paymentReference: paymentReference.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Payroll marked as paid.");
          onClose();
        },
        onError: (cause) => setError(cause.message),
      },
    );
  };
  return (
    <Modal open={open} onClose={onClose} title="Mark Payroll Paid">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Payment method
          <select
            value={paymentMethod}
            onChange={(event) =>
              setPaymentMethod(event.target.value as PayrollPaymentMethod)
            }
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank transfer</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Payment reference
          <input
            value={paymentReference}
            onChange={(event) => {
              setPaymentReference(event.target.value);
              setError("");
            }}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
            placeholder="Receipt, transfer, or voucher number"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {mutation.isPending ? "Saving..." : "Mark paid"}
        </button>
      </form>
    </Modal>
  );
}
