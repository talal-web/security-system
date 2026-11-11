"use client";

import { useState } from "react";
import { toast } from "sonner";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import InvoiceActions from "@/components/invoice/InvoiceActions";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import InvoiceRegister from "@/components/invoice/InvoiceRegister";
import { PageContainer } from "@/components/ui/PageHeader";
import { useSaveInvoice } from "@/hooks/invoice/useInvoices";
import type { InvoiceData } from "@/types/invoice";
import { invoiceDefaults } from "@/utils/invoice/invoiceDefaults";

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  // Invoice number of the draft that was last saved. Used to show "Saved"
  // until the draft is edited.
  const [savedNumber, setSavedNumber] = useState<string | null>(null);
  const saveMutation = useSaveInvoice();

  const handleGenerateInvoice = (data: InvoiceData) => {
    setInvoice(data);
    setSavedNumber(null);
  };

  const handleEditInvoice = () => {
    setInvoice(null);
    setSavedNumber(null);
  };

  const handleSaveInvoice = () => {
    if (!invoice) return;

    saveMutation.mutate(invoice, {
      onSuccess: (saved) => {
        setSavedNumber(saved.invoiceNumber);
        toast.success(
          `Invoice ${saved.invoiceNumber} saved. Admins have been notified.`,
        );
      },
      onError: (cause) => toast.error(cause.message),
    });
  };

  return (
    <ProtectedRoute allowedRoles={["developer"]}>
      <PageContainer
        className={
          invoice
            ? "max-w-225 print:bg-white print:p-0"
            : "max-w-5xl print:bg-white print:p-0"
        }
      >
        {!invoice ? (
          <InvoiceForm
            initialData={invoiceDefaults}
            onSubmit={handleGenerateInvoice}
          />
        ) : (
          <div>
            <InvoiceActions
              invoice={invoice}
              onEdit={handleEditInvoice}
              onSave={handleSaveInvoice}
              isSaving={saveMutation.isPending}
              isSaved={savedNumber === invoice.invoiceNumber}
            />

            <InvoicePreview data={invoice} />
          </div>
        )}

        <div className="mt-10 print:hidden">
          <InvoiceRegister />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
