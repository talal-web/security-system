"use client";

import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useConfirmInvoicePayment } from "@/hooks/invoice/useInvoices";
import type { InvoicePaymentMethod, StoredInvoice } from "@/types/invoice";

const fieldClass =
  "mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 shadow-card placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

const todayIso = () => new Date().toISOString().slice(0, 10);

interface ConfirmInvoicePaymentDialogProps {
  open: boolean;
  invoice: StoredInvoice | null;
  onClose: () => void;
}

/**
 * Developer confirms that the client's money has arrived.
 * Mounted only while an invoice is selected, so state resets per invoice.
 */
export default function ConfirmInvoicePaymentDialog({
  open,
  invoice,
  onClose,
}: ConfirmInvoicePaymentDialogProps) {
  if (!invoice) return null;

  return (
    <Modal open={open} onClose={onClose} title="Confirm Payment Received">
      <ConfirmForm key={invoice._id} invoice={invoice} onClose={onClose} />
    </Modal>
  );
}

function ConfirmForm({
  invoice,
  onClose,
}: {
  invoice: StoredInvoice;
  onClose: () => void;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<InvoicePaymentMethod>("bank_transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paidOn, setPaidOn] = useState(todayIso());
  const [error, setError] = useState("");
  const mutation = useConfirmInvoicePayment();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!paymentReference.trim()) {
      return setError("Payment reference is required.");
    }

    mutation.mutate(
      {
        invoiceId: invoice._id,
        payload: {
          paymentMethod,
          paymentReference: paymentReference.trim(),
          paidOn,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Invoice ${invoice.invoiceNumber} marked as paid.`);
          onClose();
        },
        onError: (cause) => setError(cause.message),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-900">
            {invoice.invoiceNumber}
          </span>{" "}
          from {invoice.clientName}
        </p>
        <p className="mt-0.5">Amount: {invoice.amount.toLocaleString("en-US")}</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Payment method
        <select
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as InvoicePaymentMethod)
          }
          className={fieldClass}
        >
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
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
          className={fieldClass}
          placeholder="Transaction ID or receipt number"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Date received
        <input
          type="date"
          value={paidOn}
          max={todayIso()}
          onChange={(event) => setPaidOn(event.target.value)}
          className={fieldClass}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Saving..." : "Confirm payment"}
      </Button>
    </form>
  );
}
