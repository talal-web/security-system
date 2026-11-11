export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;

  serviceFrom: string;
  serviceTo: string;
  dueDate: string;

  clientName: string;
  preparedBy: string;

  description: string;
  amount: number;

  // Only used to render the PDF preview. Saved invoices are always pending
  // until a developer confirms payment.
  paymentStatus: "PAID" | "PENDING";

  notes: string;

  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
}

export type InvoiceStatus = "pending" | "paid";

export type InvoicePaymentMethod = "cash" | "bank_transfer" | "other";

/** An invoice as stored on the server. */
export interface StoredInvoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  serviceFrom: string;
  serviceTo: string;
  dueDate: string;
  clientName: string;
  preparedBy: string;
  description: string;
  amount: number;
  notes: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  status: InvoiceStatus;
  paidOn: string | null;
  paymentMethod: InvoicePaymentMethod | null;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmInvoicePaymentPayload {
  paymentMethod: InvoicePaymentMethod;
  paymentReference: string;
  paidOn?: string;
}
