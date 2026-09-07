"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
} from "lucide-react";

import type { InvoiceData } from "@/types/invoice";
import {
  formatCurrency,
  formatDate,
  formatServicePeriod,
  numberToWords,
} from "@/utils/invoice/formatInvoice";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const isPaid = data.paymentStatus === "PAID";

  const hasBankDetails =
    data.bankName.trim() ||
    data.accountTitle.trim() ||
    data.accountNumber.trim() ||
    data.iban.trim();

  return (
    <div
      id="invoice-print"
      className="mx-auto w-full max-w-[850px] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl print:max-w-none print:rounded-none print:shadow-none"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="border-b-2 border-slate-200 px-8 py-8 sm:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  TJNex Technologies
                </h1>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Technical Support & Software Services
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Identity */}
          <div className="sm:text-right">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-500">
              Invoice
            </p>

            <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              {data.invoiceNumber}
            </p>

            <div className="mt-3 sm:flex sm:justify-end">
              <PaymentStatus paid={isPaid} />
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          INVOICE INFORMATION
      ===================================================== */}
      <section className="border-b border-slate-200 bg-slate-50 px-8 py-6 sm:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <InfoBlock
            icon={<CalendarDays className="h-4 w-4" />}
            label="Invoice Date"
            value={formatDate(data.invoiceDate)}
          />

          <InfoBlock
            icon={<FileText className="h-4 w-4" />}
            label="Service Period"
            value={formatServicePeriod(data.serviceFrom, data.serviceTo)}
          />

          <InfoBlock
            icon={<Clock3 className="h-4 w-4" />}
            label="Due Date"
            value={formatDate(data.dueDate)}
            important
          />
        </div>
      </section>

      {/* =====================================================
          BILL TO
      ===================================================== */}
      <section className="px-8 pt-8 sm:px-10">
        <div className="rounded-xl border-2 border-slate-200 bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Bill To
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">
            {data.clientName}
          </h2>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}
      <section className="px-8 py-7 sm:px-10">
        <div className="overflow-hidden rounded-xl border-2 border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide">
                  Description
                </th>

                <th className="hidden px-5 py-4 text-center text-xs font-extrabold uppercase tracking-wide sm:table-cell">
                  Quantity
                </th>

                <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="px-5 py-6 align-top">
                  <p className="text-base font-bold leading-6 text-slate-950">
                    {data.description}
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                    Service period:{" "}
                    {formatServicePeriod(data.serviceFrom, data.serviceTo)}
                  </p>
                </td>

                <td className="hidden px-5 py-6 text-center align-top text-sm font-semibold text-slate-700 sm:table-cell">
                  1 Month
                </td>

                <td className="whitespace-nowrap px-5 py-6 text-right align-top text-base font-extrabold text-slate-950">
                  {formatCurrency(data.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          TOTALS
      ===================================================== */}
      <section className="px-8 pb-7 sm:px-10">
        <div className="ml-auto w-full max-w-sm">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 text-sm">
            <span className="font-semibold text-slate-500">Subtotal</span>

            <span className="font-bold text-slate-900">
              {formatCurrency(data.amount)}
            </span>
          </div>

          {/* Important Total */}
          <div className="mt-4 rounded-xl border-2 border-slate-900 bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-bold">TOTAL DUE</span>

              <span className="text-2xl font-extrabold tracking-tight">
                {formatCurrency(data.amount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AMOUNT IN WORDS
      ===================================================== */}
      <section className="mx-8 rounded-xl border-2 border-slate-200 bg-slate-50 px-5 py-4 sm:mx-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-500">
          Amount in Words
        </p>

        <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
          {numberToWords(data.amount)}
        </p>
      </section>

      {/* =====================================================
          BANK DETAILS
      ===================================================== */}
      {hasBankDetails && (
        <section className="px-8 py-8 sm:px-10">
          <div className="overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-sm">
            {/* Payment Details Header */}
            <div className="flex items-center gap-3 border-b-2 border-slate-200 bg-slate-950 px-5 py-4 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold uppercase tracking-[0.1em]">
                  Payment Details
                </h3>

                <p className="mt-0.5 text-xs font-medium text-slate-300">
                  Bank transfer information
                </p>
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
              {data.bankName.trim() && (
                <BankDetail label="Bank Name" value={data.bankName} />
              )}

              {data.accountTitle.trim() && (
                <BankDetail label="Account Title" value={data.accountTitle} />
              )}

              {data.accountNumber.trim() && (
                <BankDetail
                  label="Account Number"
                  value={data.accountNumber}
                  important
                  mono
                />
              )}

              {data.iban.trim() && (
                <BankDetail label="IBAN" value={data.iban} important mono />
              )}
            </div>

            {/* Payment Notice */}
            <div className="border-t-2 border-slate-200 bg-slate-50 px-5 py-3">
              <p className="text-xs font-semibold leading-5 text-slate-600">
                Please use the account details above when making your payment.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          NOTES
      ===================================================== */}
      {data.notes.trim() && (
        <section className="px-8 pb-7 sm:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-500">
              Notes
            </p>

            <p className="mt-2 whitespace-pre-line text-sm font-medium leading-6 text-slate-700">
              {data.notes}
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t-2 border-slate-200 px-8 py-8 sm:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">
            Thank you for your business.
          </p>

          {data.preparedBy.trim() && (
            <p className="mt-2 text-sm font-medium text-slate-500">
              Prepared by:{" "}
              <span className="font-bold text-slate-800">
                {data.preparedBy}
              </span>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   INFO BLOCK
========================================================= */

interface InfoBlockProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  important?: boolean;
}

function InfoBlock({ icon, label, value, important = false }: InfoBlockProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <p className="text-xs font-extrabold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 ${
          important
            ? "text-base font-extrabold text-slate-950"
            : "text-sm font-bold text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   BANK DETAIL
========================================================= */

interface BankDetailProps {
  label: string;
  value: string;
  mono?: boolean;
  important?: boolean;
}

function BankDetail({
  label,
  value,
  mono = false,
  important = false,
}: BankDetailProps) {
  return (
    <div
      className={`px-5 py-5 ${
        important ? "border-t border-slate-200 sm:border-t-0" : ""
      }`}
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 break-all ${
          important
            ? "text-base font-extrabold text-slate-950 sm:text-lg"
            : "text-sm font-bold text-slate-900"
        } ${mono ? "font-mono tracking-wide" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PAYMENT STATUS
========================================================= */

function PaymentStatus({ paid }: { paid: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
        paid
          ? "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-2 ring-amber-200"
      }`}
    >
      {paid ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Clock3 className="h-4 w-4" />
      )}

      {paid ? "PAID" : "PENDING"}
    </div>
  );
}
