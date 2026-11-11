"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSelectedArea } from "@/components/area/AreaContext";
import { useGeneratePayroll } from "@/hooks/payroll/usePayroll";
import { lookupEmployee } from "@/services/employee.service";
import type { EmployeeLookupResult } from "@/types/employee";

const fieldClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

export default function GeneratePayrollDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [empId, setEmpId] = useState("");
  const [employee, setEmployee] = useState<EmployeeLookupResult | null>(null);
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { selectedAreaId } = useSelectedArea();
  const mutation = useGeneratePayroll();
  const lookup = async () => {
    if (!selectedAreaId) {
      setError("No area is selected.");
      return;
    }

    try {
      setError("");
      setEmployee(await lookupEmployee(empId.trim(), selectedAreaId));
    } catch (cause) {
      setEmployee(null);
      setError(cause instanceof Error ? cause.message : "Employee not found");
    }
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!employee) return setError("Look up an employee first.");
    mutation.mutate(
      { employeeId: employee._id, year, month },
      {
        onSuccess: () => {
          toast.success("Payroll generated.");
          onClose();
        },
        onError: (cause) => setError(cause.message),
      },
    );
  };
  return (
    <Modal open={open} onClose={onClose} title="Generate Payroll">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-2">
          <input
            value={empId}
            onChange={(event) => setEmpId(event.target.value)}
            placeholder="Employee ID"
            className={`min-w-0 flex-1 ${fieldClass}`}
          />
          <Button
            variant="secondary"
            onClick={lookup}
            disabled={!empId.trim()}
          >
            Lookup
          </Button>
        </div>
        {employee && (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
            {employee.name} ({employee.empId})
          </p>
        )}
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
          {mutation.isPending ? "Generating..." : "Generate payroll"}
        </Button>
      </form>
    </Modal>
  );
}
