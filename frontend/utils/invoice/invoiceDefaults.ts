import type { InvoiceData } from "@/types/invoice";

export const invoiceDefaults: InvoiceData = {
  invoiceNumber: "TJNEX-2026-001",
  invoiceDate: "2026-08-01",

  serviceFrom: "2026-08-01",
  serviceTo: "2026-08-31",
  dueDate: "2026-08-07",

  clientName: "Muhammad Sufyan",

  // Leave blank so the user enters the actual person.
  preparedBy: "",

  description: "Technical Support & Maintenance – Security Management System",

  amount: 12000,

  paymentStatus: "PENDING",

  notes:
    "Hosting, VPS, domain, database, Cloudinary, email, SMS, WhatsApp, APIs, and other third-party charges are paid separately by the client.",

  bankName: "",
  accountTitle: "",
  accountNumber: "",
  iban: "",
};
