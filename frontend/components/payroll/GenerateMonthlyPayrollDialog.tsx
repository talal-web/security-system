"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { useGenerateMonthlyPayroll } from "@/hooks/payroll/usePayroll";

export default function GenerateMonthlyPayrollDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [error, setError] = useState("");
  const mutation = useGenerateMonthlyPayroll();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(
      { year, month },
      {
        onSuccess: (response) => {
          toast.success(
            `Generated ${response.data.generated} payroll record(s).`,
          );
          onClose();
        },
        onError: (cause) => setError(cause.message),
      },
    );
  };
  return (
    <Modal open={open} onClose={onClose} title="Generate Monthly Payroll">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-slate-600">
          Draft payroll will be created for all eligible employees without an
          existing record for this month.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <input
            aria-label="Year"
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          />
          <select
            aria-label="Month"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(2000, index).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {mutation.isPending ? "Generating..." : "Generate month"}
        </button>
      </form>
    </Modal>
  );
}
