"use client";

import { useEffect, useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateBankEntry, useUpdateBankEntry } from "@/hooks/bank/useBank";

import {
  BANK_KIND_LABELS,
  type BankEntry,
  type ManualBankEntryKind,
} from "@/types/bank";

interface BankEntryModalProps {
  open: boolean;
  onClose: () => void;
  /** Pass an entry to edit it; omit to record a new one. */
  entry?: BankEntry | null;
  /** Pre-selects the type for new entries (e.g. "income" from the Add income button). */
  defaultKind?: ManualBankEntryKind;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const labelClass = "block text-xs font-medium text-slate-600";

// Advances and salaries are recorded from the Advances and Payroll pages only.
const KIND_CHOICES: ManualBankEntryKind[] = [
  "income",
  "rent",
  "expense",
  "savings_deposit",
  "savings_withdrawal",
];

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function BankEntryModal({
  open,
  onClose,
  entry,
  defaultKind = "income",
}: BankEntryModalProps) {
  const isEdit = Boolean(entry);

  const [kind, setKind] = useState<ManualBankEntryKind>(defaultKind);
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState(todayIso());
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createEntry = useCreateBankEntry();
  const updateEntry = useUpdateBankEntry();
  const saving = createEntry.isPending || updateEntry.isPending;

  // Reset the form each time it opens.
  useEffect(() => {
    if (!open) return;

    setError(null);

    if (entry) {
      // Legacy advance/salary rows may still exist; show them under the
      // nearest manual type so the select has a valid value.
      const manualKind = KIND_CHOICES.includes(entry.kind as ManualBankEntryKind)
        ? (entry.kind as ManualBankEntryKind)
        : "expense";
      setKind(manualKind);
      setAmount(String(entry.amount));
      setEntryDate(entry.entryDate.slice(0, 10));
      setCategory(entry.category ?? "");
      setDescription(entry.description ?? "");
    } else {
      setKind(defaultKind);
      setAmount("");
      setEntryDate(todayIso());
      setCategory("");
      setDescription("");
    }
  }, [open, entry, defaultKind]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    const payload = {
      kind,
      amount: parsedAmount,
      entryDate,
      category: category.trim(),
      description: description.trim(),
    };

    try {
      if (entry) {
        await updateEntry.mutateAsync({ id: entry._id, payload });
      } else {
        await createEntry.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit bank entry" : "Record bank entry"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={labelClass}>Type</span>
          <select
            className={inputClass}
            value={kind}
            onChange={(e) => setKind(e.target.value as ManualBankEntryKind)}
          >
            {KIND_CHOICES.map((k) => (
              <option key={k} value={k}>
                {BANK_KIND_LABELS[k]}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-500">
            Advances and salaries are recorded from the Advances and Payroll pages.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Amount</span>
            <input
              className={inputClass}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <label className="block">
            <span className={labelClass}>Date received / paid</span>
            <input
              className={inputClass}
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Category</span>
          <input
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Electricity, Office, Fuel"
            maxLength={100}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Note</span>
          <textarea
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={500}
          />
        </label>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Record entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
