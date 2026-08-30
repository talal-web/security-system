"use client";

import { CircleDollarSign, Pencil, UserRound, XCircle } from "lucide-react";

import AdvanceHistoryMobileCard from "./AdvanceHistoryMobileCard";

import type { Advance } from "@/types/advance";

interface AdvanceHistoryProps {
  advances: Advance[];
  canEdit?: boolean;
  onEdit?: (advance: Advance) => void;
  onCancel?: (advance: Advance) => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-blue-50 text-blue-700 ring-blue-600/10",
    dotClass: "bg-blue-500",
  },
  partially_deducted: {
    label: "Partially Deducted",
    className: "bg-amber-50 text-amber-700 ring-amber-600/10",
    dotClass: "bg-amber-500",
  },
  fully_deducted: {
    label: "Fully Deducted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    dotClass: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 ring-gray-500/10",
    dotClass: "bg-gray-400",
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

function getEmployeeName(advance: Advance) {
  if (typeof advance.employee === "string") {
    return "Employee";
  }

  return advance.employee.name;
}

function getCreatedBy(advance: Advance) {
  if (typeof advance.createdBy === "string") {
    return "—";
  }

  return advance.createdBy.name;
}

export default function AdvanceHistory({
  advances,
  canEdit = false,
  onEdit,
  onCancel,
}: AdvanceHistoryProps) {
  if (!advances.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        {" "}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          {" "}
          <UserRound className="h-5 w-5 text-slate-400" />{" "}
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No advance records
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          No advance has been recorded for this employee yet.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ========================================================= */}
      {/* Header */}
      {/* ========================================================= */}
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Advance History
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              {advances.length} record
              {advances.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
            <CircleDollarSign className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Desktop / Tablet */}
      {/* ========================================================= */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3">Employee</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Advance</th>
              <th className="px-4 py-3">Deducted</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>

              {canEdit && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {advances.map((advance) => {
              const deductedAmount = advance.amount - advance.remainingAmount;

              const config =
                statusConfig[advance.status] ?? statusConfig.cancelled;

              const canModify =
                advance.status === "active" &&
                advance.remainingAmount === advance.amount;

              return (
                <tr
                  key={advance._id}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  {/* Employee */}

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {getEmployeeName(advance)}
                    </div>

                    {typeof advance.employee !== "string" && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {advance.employee.fatherName}
                      </div>
                    )}
                  </td>

                  {/* Date */}

                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {formatDate(advance.advanceDate)}
                  </td>

                  {/* Advance */}

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                    {formatCurrency(advance.amount)}
                  </td>

                  {/* Deducted */}

                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {formatCurrency(deductedAmount)}
                  </td>

                  {/* Remaining */}

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                    {formatCurrency(advance.remainingAmount)}
                  </td>

                  {/* Status */}

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
                      />

                      {config.label}
                    </span>
                  </td>

                  {/* Created By */}

                  <td className="px-4 py-4 text-slate-600">
                    {getCreatedBy(advance)}
                  </td>

                  {/* Actions */}

                  {canEdit && (
                    <td className="px-6 py-4">
                      {canModify && (
                        <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(advance)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          )}

                          {onCancel && (
                            <button
                              type="button"
                              onClick={() => onCancel(advance)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 active:scale-[0.98]"
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

      {/* ========================================================= */}
      {/* Mobile */}
      {/* ========================================================= */}

      <div className="space-y-3 bg-slate-50/50 p-3 sm:p-4 md:hidden">
        {advances.map((advance) => (
          <AdvanceHistoryMobileCard
            key={advance._id}
            advance={advance}
            canEdit={canEdit}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        ))}
      </div>
    </section>
  );
}
