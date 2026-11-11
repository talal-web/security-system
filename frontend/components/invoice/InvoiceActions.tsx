"use client";

import { ArrowLeft, Download, Pencil, Printer } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Button, buttonVariants } from "@/components/ui/Button";
import type { InvoiceData } from "@/types/invoice";
import InvoicePDF from "./InvoicePDF";

interface InvoiceActionsProps {
  invoice: InvoiceData;
  onEdit: () => void;
  onBack?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export default function InvoiceActions({
  invoice,
  onEdit,
  onBack,
  onSave,
  isSaving = false,
  isSaved = false,
}: InvoiceActionsProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      {/* Left Actions */}
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Edit */}
        <Button variant="secondary" onClick={onEdit}>
          <Pencil />
          Edit Invoice
        </Button>

        {/* Save to the invoice register (notifies admins) */}
        {onSave && (
          <Button onClick={onSave} disabled={isSaving || isSaved}>
            {isSaved ? "Saved" : isSaving ? "Saving..." : "Save invoice"}
          </Button>
        )}

        {/* Print */}
        <Button variant="secondary" onClick={handlePrint}>
          <Printer />
          Print
        </Button>

        {/* Download PDF */}
        <PDFDownloadLink
          document={<InvoicePDF data={invoice} />}
          fileName={`${invoice.invoiceNumber}.pdf`}
          className={buttonVariants({ variant: "primary" })}
        >
          {({ loading }) => (
            <>
              <Download />

              {loading ? "Preparing PDF..." : "Download PDF"}
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
