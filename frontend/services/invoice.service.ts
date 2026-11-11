import api from "@/lib/axios";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";
import type {
  ConfirmInvoicePaymentPayload,
  InvoiceData,
  InvoiceStatus,
  StoredInvoice,
} from "@/types/invoice";

function toInvoiceApiError(error: unknown): ApiError {
  return new ApiError(getApiErrorMessage(error), getApiErrorStatus(error));
}

// ============================================================================
// SAVE INVOICE
// ============================================================================

export async function createInvoice(
  invoice: InvoiceData,
): Promise<StoredInvoice> {
  try {
    // paymentStatus is a PDF-only field; the server always starts invoices
    // as pending, so it is not sent.
    const payload: Partial<InvoiceData> = { ...invoice };
    delete payload.paymentStatus;

    const res = await api.post("/invoices", payload);

    return res.data.data;
  } catch (error) {
    throw toInvoiceApiError(error);
  }
}

// ============================================================================
// LIST INVOICES
// ============================================================================

export async function getInvoices(
  status?: InvoiceStatus,
): Promise<StoredInvoice[]> {
  try {
    const res = await api.get("/invoices", {
      params: status ? { status } : undefined,
    });

    return res.data.data;
  } catch (error) {
    throw toInvoiceApiError(error);
  }
}

// ============================================================================
// CONFIRM PAYMENT
// ============================================================================

export async function confirmInvoicePayment(
  invoiceId: string,
  payload: ConfirmInvoicePaymentPayload,
): Promise<StoredInvoice> {
  try {
    const res = await api.patch(
      `/invoices/${invoiceId}/confirm-payment`,
      payload,
    );

    return res.data.data;
  } catch (error) {
    throw toInvoiceApiError(error);
  }
}
