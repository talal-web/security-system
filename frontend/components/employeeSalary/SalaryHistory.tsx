"use client";

import { Pencil, CalendarDays } from "lucide-react";

import type { EmployeeSalary } from "@/types/employeeSalary";

interface SalaryHistoryProps {
  salaryHistory: EmployeeSalary[];
  onEdit?: (salary: EmployeeSalary) => void;
  canEdit?: boolean;
}

export default function SalaryHistory({
  salaryHistory,
  onEdit,
  canEdit = false,
}: SalaryHistoryProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Salary History
          </h2>
          <p className="text-sm text-gray-500">
            {salaryHistory.length} record{salaryHistory.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {salaryHistory.length === 0 ? (
        <p className="text-sm text-gray-500">No salary history available.</p>
      ) : (
        <div className="space-y-3">
          {salaryHistory.map((salary) => (
            <div
              key={salary._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Effective from{" "}
                      {new Date(salary.effectiveFrom).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    Rs. {salary.monthlySalary.toLocaleString()}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                      {salary.reason.replaceAll("_", " ")}
                    </span>

                    {salary.notes && (
                      <span className="text-xs text-gray-500">
                        {salary.notes}
                      </span>
                    )}
                  </div>
                </div>

                {canEdit && onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(salary)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Correct
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
