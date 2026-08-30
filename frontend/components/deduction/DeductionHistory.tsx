"use client";

import {
  CalendarDays,
  CircleDollarSign,
  Pencil,
  UserRound,
  XCircle,
} from "lucide-react";

import type { Deduction } from "@/types/deduction";

interface DeductionHistoryProps {
  deductions: Deduction[];
  canEdit?: boolean;
  onEdit?: (deduction: Deduction) => void;
  onCancel?: (deduction: Deduction) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-blue-50 text-blue-700",
  },
  partially_deducted: {
    label: "Partially Deducted",
    className: "bg-amber-50 text-amber-700",
  },
  fully_deducted: {
    label: "Fully Deducted",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600",
  },
} as const;

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEmployeeName(deduction: Deduction) {
  if (typeof deduction.employee === "string") {
    return "Employee";
  }

  return deduction.employee.name;
}

function getCreatedBy(deduction: Deduction) {
  if (typeof deduction.createdBy === "string") {
    return "—";
  }

  return deduction.createdBy.name;
}

export default function DeductionHistory({
  deductions,
  canEdit = false,
  onEdit,
  onCancel,
}: DeductionHistoryProps) {
  if (!deductions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <CircleDollarSign className="h-5 w-5 text-gray-500" />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No deduction records
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          No deductions have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          Deduction History
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {deductions.length} record
          {deductions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50/80">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-6 py-3">Employee</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Deduction</th>
              <th className="px-4 py-3">Deducted</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>

              {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {deductions.map((deduction) => {
              const deductedAmount =
                deduction.amount - deduction.remainingAmount;

              const config = statusConfig[deduction.status];

              const canModify =
                deduction.status === "pending" &&
                deduction.remainingAmount === deduction.amount;

              return (
                <tr
                  key={deduction._id}
                  className="transition hover:bg-gray-50/70"
                >
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {getEmployeeName(deduction)}
                    </div>

                    {typeof deduction.employee !== "string" && (
                      <div className="mt-0.5 text-xs text-gray-500">
                        {deduction.employee.fatherName}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                    {formatDate(deduction.deductionDate)}
                  </td>

                  {/* Original amount */}
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900">
                    {formatCurrency(deduction.amount)}
                  </td>

                  {/* Deducted */}
                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                    {formatCurrency(deductedAmount)}
                  </td>

                  {/* Remaining */}
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900">
                    {formatCurrency(deduction.remainingAmount)}
                  </td>

                  {/* Reason */}
                  <td className="max-w-60 px-4 py-4">
                    <span className="block truncate text-gray-600">
                      {deduction.reason}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                    >
                      {config.label}
                    </span>
                  </td>

                  {/* Creator */}
                  <td className="px-4 py-4 text-gray-600">
                    {getCreatedBy(deduction)}
                  </td>

                  {/* Actions */}
                  {canEdit && (
                    <td className="px-6 py-4">
                      {canModify && (
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(deduction)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          )}

                          {onCancel && (
                            <button
                              type="button"
                              onClick={() => onCancel(deduction)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-gray-100 md:hidden">
        {deductions.map((deduction) => {
          const deductedAmount = deduction.amount - deduction.remainingAmount;

          const config = statusConfig[deduction.status];

          const canModify =
            deduction.status === "pending" &&
            deduction.remainingAmount === deduction.amount;

          return (
            <article key={deduction._id} className="p-4">
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {getEmployeeName(deduction)}
                  </h3>

                  {typeof deduction.employee !== "string" && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {deduction.employee.fatherName}
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                >
                  {config.label}
                </span>
              </div>

              {/* Financial details */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Deduction</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatCurrency(deduction.amount)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Remaining</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatCurrency(deduction.remainingAmount)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Deducted</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {formatCurrency(deductedAmount)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Date</p>

                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(deduction.deductionDate)}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Reason</p>

                    <p className="mt-1 text-sm leading-5 text-gray-700">
                      {deduction.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canEdit && canModify && (
                <div className="mt-3 flex justify-end gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(deduction)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}

                  {onCancel && (
                    <button
                      type="button"
                      onClick={() => onCancel(deduction)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {/* Created by */}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <UserRound className="h-3.5 w-3.5" />
                <span>
                  Created by{" "}
                  <span className="font-medium text-gray-700">
                    {getCreatedBy(deduction)}
                  </span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
