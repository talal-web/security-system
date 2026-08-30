"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateEmployeeSalary,
  useUpdateEmployeeSalary,
} from "@/hooks/employeeSalary/useEmployeeSalary";

import type {
  EmployeeSalary,
  SalaryChangeReason,
} from "@/types/employeeSalary";
import { getApiErrorMessage } from "@/lib/apiError";

interface SalaryFormProps {
  employeeId: string;
  salary?: EmployeeSalary | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const reasons: {
  value: SalaryChangeReason;
  label: string;
}[] = [
  { value: "salary_increase", label: "Salary Increase" },
  { value: "salary_decrease", label: "Salary Decrease" },
  { value: "promotion", label: "Promotion" },
  { value: "designation_change", label: "Designation Change" },
  { value: "other", label: "Other" },
];

export default function SalaryForm({
  employeeId,
  salary,
  onSuccess,
  onCancel,
}: SalaryFormProps) {
  const isEditing = Boolean(salary);

  const createSalary = useCreateEmployeeSalary();
  const updateSalary = useUpdateEmployeeSalary(employeeId);

  const [monthlySalary, setMonthlySalary] = useState(
    salary?.monthlySalary?.toString() ?? "",
  );

  const [effectiveFrom, setEffectiveFrom] = useState(
    salary ? salary.effectiveFrom.slice(0, 10) : "",
  );

  const [reason, setReason] = useState<SalaryChangeReason>(
    salary?.reason ?? "salary_increase",
  );

  const [notes, setNotes] = useState(salary?.notes ?? "");
  const [formError, setFormError] = useState("");

  const mutation = isEditing ? updateSalary : createSalary;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    const amount = Number(monthlySalary);

    if (!Number.isFinite(amount) || amount < 0) {
      setFormError("Enter a valid non-negative monthly salary.");
      return;
    }

    if (!effectiveFrom) {
      setFormError("Select an effective date.");
      return;
    }

    const date = new Date(`${effectiveFrom}T00:00:00Z`);

    if (date.getUTCDate() !== 1) {
      setFormError("The effective date must be the first day of a month.");
      return;
    }

    if (isEditing && salary) {
      updateSalary.mutate(
        {
          salaryId: salary._id,
          data: {
            monthlySalary: amount,
            effectiveFrom,
            reason,
            notes,
          },
        },
        {
          onSuccess: () => {
            toast.success("Salary correction saved successfully.");
            onSuccess();
          },
          onError: (error) =>
            toast.error(
              getApiErrorMessage(error) || "Failed to correct salary.",
            ),
        },
      );

      return;
    }

    createSalary.mutate(
      {
        employee: employeeId,
        monthlySalary: amount,
        effectiveFrom,
        reason,
        notes,
      },
      {
        onSuccess: () => {
          toast.success("Salary added successfully.");
          onSuccess();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error) || "Failed to add salary."),
      },
    );
  };

  const isPending = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Correct Salary" : "Add Salary"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? "Correct an existing salary record."
            : "Add a new salary effective from a future month."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Monthly Salary
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Effective From
          </label>

          <input
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="mt-1 text-xs text-gray-500">
            Must be the first day of a month.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Reason</label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as SalaryChangeReason)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {reasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes</label>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        {formError && (
          <p className="mr-auto self-center text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Correction"
              : "Add Salary"}
        </button>
      </div>
    </form>
  );
}
