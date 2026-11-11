import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  confirmInvoicePayment,
  createInvoice,
  getInvoices,
} from "@/services/invoice.service";
import type {
  ConfirmInvoicePaymentPayload,
  InvoiceData,
  InvoiceStatus,
} from "@/types/invoice";

export const invoiceKeys = {
  all: ["invoices"] as const,
  list: (status?: InvoiceStatus) => [...invoiceKeys.all, "list", status ?? "all"] as const,
};

export function useInvoices(status?: InvoiceStatus) {
  return useQuery({
    queryKey: invoiceKeys.list(status),
    queryFn: () => getInvoices(status),
  });
}

export function useSaveInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoice: InvoiceData) => createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}

export function useConfirmInvoicePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceId,
      payload,
    }: {
      invoiceId: string;
      payload: ConfirmInvoicePaymentPayload;
    }) => confirmInvoicePayment(invoiceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
}
