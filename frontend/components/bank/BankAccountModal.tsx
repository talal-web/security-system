"use client";

import { useEffect, useState, type FormEvent } from "react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUpdateBankAccount } from "@/hooks/bank/useBank";
import type { BankAccountSummary } from "@/types/bank";

interface BankAccountModalProps {
  open: boolean;
  onClose: () => void;
  account: BankAccountSummary;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export default function BankAccountModal({
  open,
  onClose,
  account,
}: BankAccountModalProps) {
  const [name, setName] = useState(account.name);
  const [openingBalance, setOpeningBalance] = useState(String(account.openingBalance));
  const [openingDate, setOpeningDate] = useState(account.openingDate.slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const updateAccount = useUpdateBankAccount();

  useEffect(() => {
    if (!open) return;
    setName(account.name);
    setOpeningBalance(String(account.openingBalance));
    setOpeningDate(account.openingDate.slice(0, 10));
    setError(null);
  }, [open, account]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const balance = Number(openingBalance);
    if (!Number.isFinite(balance) || balance < 0) {
      setError("Opening balance must be zero or more.");
      return;
    }

    try {
      await updateAccount.mutateAsync({
        name: name.trim(),
        openingBalance: balance,
        openingDate,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Bank account setup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-medium text-slate-600">Account name</span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            required
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600">Opening balance</span>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            required
          />
          <span className="mt-1 block text-xs text-slate-500">
            The bank balance on the opening date. Change it any time.
          </span>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600">Opening date</span>
          <input
            className={inputClass}
            type="date"
            value={openingDate}
            onChange={(e) => setOpeningDate(e.target.value)}
            required
          />
          <span className="mt-1 block text-xs text-slate-500">
            Must be the 1st of a month. Locked once any entry exists.
          </span>
        </label>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateAccount.isPending}>
            {updateAccount.isPending ? "Saving..." : "Save account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
