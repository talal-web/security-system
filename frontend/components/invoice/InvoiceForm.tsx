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

import type { InvoiceData } from "@/types/invoice";
import { invoiceDefaults } from "@/utils/invoice/invoiceDefaults";

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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Create Invoice
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Enter the invoice details below and generate a professional
              invoice.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* =====================================================
          INVOICE INFORMATION
      ===================================================== */}
      <FormSection
        icon={<FileText className="h-4 w-4" />}
        title="Invoice Information"
        description="Basic information about this invoice."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
        description="Define the service being billed and payment status."
      >
        <div className="space-y-5">
          <FormField
            label="Service Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Technical Support & Maintenance – Security Management System"
            required
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

            <div>
              <label
                htmlFor="paymentStatus"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Payment Status
              </label>

              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      </FormSection>

      {/* =====================================================
          ACTIONS
      ===================================================== */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          Generate Invoice
        </button>
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              {title}
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
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
        className="mb-2 block text-sm font-semibold text-slate-700"
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
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}
