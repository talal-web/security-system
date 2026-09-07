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

  paymentStatus: "PAID" | "PENDING";

  notes: string;

  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
}
