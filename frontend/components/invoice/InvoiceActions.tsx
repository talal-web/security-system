"use client";

import { ArrowLeft, Download, Pencil, Printer } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import type { InvoiceData } from "@/types/invoice";
import InvoicePDF from "./InvoicePDF";

interface InvoiceActionsProps {
  invoice: InvoiceData;
  onEdit: () => void;
  onBack?: () => void;
}

export default function InvoiceActions({
  invoice,
  onEdit,
  onBack,
}: InvoiceActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      {/* Left Actions */}
      <div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Edit */}
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          Edit Invoice
        </button>

        {/* Print */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>

        {/* Download PDF */}
        <PDFDownloadLink
          document={<InvoicePDF data={invoice} />}
          fileName={`${invoice.invoiceNumber}.pdf`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {({ loading }) => (
            <>
              <Download className="h-4 w-4" />

              {loading ? "Preparing PDF..." : "Download PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
