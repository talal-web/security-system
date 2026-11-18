"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useSelectedArea } from "@/components/area/AreaContext";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { PageContainer } from "@/components/ui/PageHeader";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useMe } from "@/hooks/auth/useMe";
import { useInvoice } from "@/hooks/invoice/useInvoices";
import type { InvoiceData, StoredInvoice } from "@/types/invoice";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

// The preview component renders the PDF layout; a stored invoice is mapped
// onto it so admins see the same document the developer issued.
function toPreviewData(invoice: StoredInvoice): InvoiceData {
  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    serviceFrom: invoice.serviceFrom,
    serviceTo: invoice.serviceTo,
    dueDate: invoice.dueDate,
    clientName: invoice.clientName,
    preparedBy: invoice.preparedBy,
    description: invoice.description,
    amount: invoice.amount,
    paymentStatus: invoice.status === "paid" ? "PAID" : "PENDING",
    notes: invoice.notes,
    bankName: invoice.bankName,
    accountTitle: invoice.accountTitle,
    accountNumber: invoice.accountNumber,
    iban: invoice.iban,
  };
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getAreaAwareHref } = useSelectedArea();
  const isDeveloper = useMe().data?.user?.role === "developer";
  const { data, isLoading, isError, error } = useInvoice(id);

  return (
    <ProtectedRoute allowedRoles={["developer", "admin"]}>
      <PageContainer className="max-w-225 print:bg-white print:p-0">
        {/* Only developers can open the invoice register; admins go back. */}
        {isDeveloper ? (
          <Link
            href={getAreaAwareHref("/invoice")}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 print:hidden"
          >
            <ArrowLeft className="size-4" />
            Back to invoices
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 print:hidden"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        )}

        <div className="mt-6">
          {isLoading && <LoadingState title="Loading invoice..." />}

          {isError && (
            <ErrorState
              title="Failed to load invoice"
              description={error.message}
            />
          )}

          {data && <InvoicePreview data={toPreviewData(data)} />}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
