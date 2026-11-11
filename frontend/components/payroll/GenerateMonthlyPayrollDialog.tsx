"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useGenerateMonthlyPayroll } from "@/hooks/payroll/usePayroll";

const fieldClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

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
            className={fieldClass}
          />
          <select
            aria-label="Month"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className={fieldClass}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(2000, index).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Generating..." : "Generate month"}
        </Button>
      </form>
    </Modal>
  );
}
