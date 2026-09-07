"use client";

import { useState } from "react";

import InvoiceActions from "@/components/invoice/InvoiceActions";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import type { InvoiceData } from "@/types/invoice";
import { invoiceDefaults } from "@/utils/invoice/invoiceDefaults";

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoice(data);
  };

  const handleEditInvoice = () => {
    setInvoice(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {!invoice ? (
        <div className="mx-auto max-w-5xl">
          <InvoiceForm
            initialData={invoiceDefaults}
            onSubmit={handleGenerateInvoice}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-225">
          <InvoiceActions invoice={invoice} onEdit={handleEditInvoice} />

          <InvoicePreview data={invoice} />
        </div>
      )}
    </main>
  );
}
