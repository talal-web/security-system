"use client";

import { Pencil, Plus } from "lucide-react";

import type { EmployeeSalary } from "@/types/employeeSalary";

interface EmployeeSalaryCardProps {
  salary?: EmployeeSalary;
  onAdd?: () => void;
  onEdit?: (salary: EmployeeSalary) => void;
  canEdit?: boolean;
}

export default function EmployeeSalaryCard({
  salary,
  onAdd,
  onEdit,
  canEdit = false,
}: EmployeeSalaryCardProps) {
  const canShowAction = canEdit && (salary ? !!onEdit : !!onAdd);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Current Monthly Salary</p>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Rs. {salary ? salary.monthlySalary.toLocaleString() : "0"}
          </h2>

          {salary && (
            <p className="mt-2 text-sm text-gray-500">
              Effective from{" "}
              {new Date(salary.effectiveFrom).toLocaleDateString()}
            </p>
          )}
        </div>

        {canShowAction && (
          <button
            type="button"
            onClick={salary ? () => onEdit?.(salary) : onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {salary ? (
              <>
                <Pencil className="h-4 w-4" />
                Correct
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Salary
              </>
            )}
          </button>
        )}
      </div>

      {salary?.reason && (
        <div className="mt-4">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {salary.reason.replaceAll("_", " ")}
          </span>
        </div>
      )}
    </div>
  );
}
