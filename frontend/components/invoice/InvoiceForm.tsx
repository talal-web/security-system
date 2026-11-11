"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  RotateCcw,
  User,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import type { InvoiceData } from "@/types/invoice";
import { invoiceDefaults } from "@/utils/invoice/invoiceDefaults";

const controlClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

interface InvoiceFormProps {
  initialData?: InvoiceData;
  onSubmit: (data: InvoiceData) => void;
}

export default function InvoiceForm({
  initialData = invoiceDefaults,
  onSubmit,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(initialData);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.invoiceNumber.trim()) {
      alert("Please enter the invoice number.");
      return;
    }

    if (!formData.invoiceDate) {
      alert("Please select the invoice date.");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select the due date.");
      return;
    }

    if (formData.dueDate < formData.invoiceDate) {
      alert("Due date cannot be before the invoice date.");
      return;
    }

    if (!formData.clientName.trim()) {
      alert("Please enter the client name.");
      return;
    }

    if (!formData.serviceFrom || !formData.serviceTo) {
      alert("Please select the service period.");
      return;
    }

    if (formData.serviceFrom > formData.serviceTo) {
      alert("Service From date cannot be after Service To date.");
      return;
    }

    if (formData.amount <= 0 || !Number.isFinite(formData.amount)) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter the service description.");
      return;
    }

    onSubmit({
      ...formData,
      clientName: formData.clientName.trim(),
      preparedBy: formData.preparedBy.trim(),
      description: formData.description.trim(),
      bankName: formData.bankName.trim(),
      accountTitle: formData.accountTitle.trim(),
      accountNumber: formData.accountNumber.trim(),
      iban: formData.iban.trim(),
      notes: formData.notes.trim(),
    });
  };

  const handleReset = () => {
    setFormData({
      ...initialData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <PageHeader
        title="Create Invoice"
        icon={FileText}
        description="Enter the invoice details below and generate a professional invoice."
        actions={
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw />
            Reset
          </Button>
        }
      />

      {/* =====================================================
          INVOICE INFORMATION
      ===================================================== */}
      <FormSection
        icon={<FileText className="h-4 w-4" />}
        title="Invoice Information"
        description="Basic information about this invoice."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            label="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="TJNEX-2026-001"
            required
            autoComplete="off"
          />

          <FormField
            label="Invoice Date"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={handleChange}
            required
          />

          <FormField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </FormSection>

      {/* =====================================================
          CLIENT INFORMATION
      ===================================================== */}
      <FormSection
        icon={<User className="h-4 w-4" />}
        title="Client Information"
        description="Enter the person or organization receiving the invoice."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Muhammad Sufyan"
            required
            autoComplete="name"
          />

          <FormField
            label="Prepared By"
            name="preparedBy"
            value={formData.preparedBy}
            onChange={handleChange}
            placeholder="Enter name (optional)"
            autoComplete="name"
          />
        </div>
      </FormSection>

      {/* =====================================================
          SERVICE PERIOD
      ===================================================== */}
      <FormSection
        icon={<CalendarDays className="h-4 w-4" />}
        title="Service Period"
        description="Select the period covered by the service or subscription."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Service From"
            name="serviceFrom"
            type="date"
            value={formData.serviceFrom}
            onChange={handleChange}
            required
          />

          <FormField
            label="Service To"
            name="serviceTo"
            type="date"
            value={formData.serviceTo}
            onChange={handleChange}
            required
          />
        </div>
      </FormSection>

      {/* =====================================================
          SERVICE & PAYMENT
      ===================================================== */}
      <FormSection
        icon={<WalletCards className="h-4 w-4" />}
        title="Service & Payment"
        description="Define the service being billed."
      >
        <div className="space-y-4">
          <FormField
            label="Service Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Technical Support & Maintenance – Security Management System"
            required
          />

          <FormField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="12000"
            min="1"
            step="1"
            required
            inputMode="numeric"
          />

          <p className="text-xs text-slate-500">
            Saved invoices start as pending. Mark them paid from the invoice
            list once the client&apos;s payment has arrived.
          </p>
        </div>
      </FormSection>

      {/* =====================================================
          BANK DETAILS
      ===================================================== */}
      <FormSection
        icon={<CreditCard className="h-4 w-4" />}
        title="Bank Details"
        description="Optional payment information for the client."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="e.g. Meezan Bank"
            autoComplete="organization"
          />

          <FormField
            label="Account Title"
            name="accountTitle"
            value={formData.accountTitle}
            onChange={handleChange}
            placeholder="e.g. TJNex Technologies"
            autoComplete="off"
          />

          <FormField
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter account number"
            autoComplete="off"
          />

          <FormField
            label="IBAN"
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            placeholder="PK00 XXXX 0000 0000 0000 0000"
            autoComplete="off"
          />
        </div>
      </FormSection>

      {/* =====================================================
          NOTES
      ===================================================== */}
      <FormSection
        icon={<Building2 className="h-4 w-4" />}
        title="Notes"
        description="Add any additional information that should appear on the invoice."
      >
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Additional invoice notes..."
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 shadow-card transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15"
        />
      </FormSection>

      {/* =====================================================
          ACTIONS
      ===================================================== */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="lg" onClick={handleReset}>
          <RotateCcw />
          Reset
        </Button>

        <Button type="submit" size="lg">
          <FileText />
          Generate Invoice
        </Button>
      </div>
    </form>
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({ icon, title, description, children }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  step?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "decimal";
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  step,
  autoComplete,
  inputMode,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={controlClass}
      />
    </div>
  );
}
