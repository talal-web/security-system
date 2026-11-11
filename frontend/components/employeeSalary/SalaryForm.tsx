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
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const fieldClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

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
    <form onSubmit={handleSubmit}>
      <Card>
      <CardHeader
        icon={isEditing ? Pencil : Plus}
        title={isEditing ? "Correct Salary" : "Add Salary"}
        description={
          isEditing
            ? "Correct an existing salary record."
            : "Add a new salary effective from a future month."
        }
      />

      <CardContent>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Monthly Salary
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Effective From
          </label>

          <input
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            required
            className={fieldClass}
          />

          <p className="mt-1 text-xs text-slate-500">
            Must be the first day of a month.
          </p>
        </div>

        <div>
          <label className={labelClass}>Reason</label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as SalaryChangeReason)}
            className={fieldClass}
          >
            {reasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Notes</label>

          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className={fieldClass}
          />
        </div>
      </div>
      </CardContent>

      <CardFooter className="flex-wrap rounded-b-xl">
        {formError && (
          <p
            className="mr-auto basis-full self-center text-sm font-medium text-red-600 sm:basis-auto"
            role="alert"
          >
            {formError}
          </p>
        )}

        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : isEditing
              ? "Save Correction"
              : "Add Salary"}
        </Button>
      </CardFooter>
      </Card>
    </form>
  );
}
