"use client";

import { useState } from "react";
import { CheckCircle2, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useInvoices } from "@/hooks/invoice/useInvoices";
import type { InvoiceStatus, StoredInvoice } from "@/types/invoice";
import ConfirmInvoicePaymentDialog from "./ConfirmInvoicePaymentDialog";

type Filter = "all" | InvoiceStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  cash: "Cash",
  other: "Other",
};

/**
 * Developer's invoice list. Pending invoices can be confirmed as paid once
 * the client's money has arrived.
 */
export default function InvoiceRegister() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<StoredInvoice | null>(null);
  const invoices = useInvoices(filter === "all" ? undefined : filter);

  const pendingCount = useInvoices("pending").data?.length ?? 0;

  return (
    <section className="print:hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Saved invoices
          </h2>
          <p className="text-sm text-slate-500">
            {pendingCount} awaiting payment
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={
                filter === item.value
                  ? "rounded-md bg-white px-3 py-1 text-sm font-medium text-slate-900 shadow-card"
                  : "rounded-md px-3 py-1 text-sm text-slate-500 hover:text-slate-900"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {invoices.isLoading && (
        <p className="text-sm text-slate-500">Loading invoices...</p>
      )}

      {invoices.isError && (
        <p className="text-sm text-red-600">{invoices.error.message}</p>
      )}

      {invoices.isSuccess && invoices.data.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No invoices here yet. Saved invoices will appear in this list.
        </p>
      )}

      {invoices.isSuccess && invoices.data.length > 0 && (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {invoices.data.map((invoice) => {
            const isPaid = invoice.status === "paid";

            return (
              <li
                key={invoice._id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    {invoice.invoiceNumber}
                    <Badge tone={isPaid ? "success" : "warning"} dot>
                      {isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {invoice.clientName} · {invoice.amount.toLocaleString("en-US")} · due{" "}
                    {formatDate(invoice.dueDate)}
                  </p>
                  {isPaid && invoice.paidOn && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      Received {formatDate(invoice.paidOn)} ·{" "}
                      {PAYMENT_LABELS[invoice.paymentMethod ?? ""] ?? "—"} ·{" "}
                      {invoice.paymentReference}
                    </p>
                  )}
                  {!isPaid && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-700">
                      <Clock3 className="size-3.5" />
                      Waiting for payment
                    </p>
                  )}
                </div>

                {!isPaid && (
                  <Button
                    variant="secondary"
                    onClick={() => setSelected(invoice)}
                  >
                    Confirm payment
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmInvoicePaymentDialog
        open={Boolean(selected)}
        invoice={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
