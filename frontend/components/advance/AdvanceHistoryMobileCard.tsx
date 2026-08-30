"use client";

import { CalendarDays, Pencil, UserRound, XCircle } from "lucide-react";

import type { Advance } from "@/types/advance";

interface AdvanceHistoryMobileCardProps {
  advance: Advance;
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

export default function AdvanceHistoryMobileCard({
  advance,
  canEdit = false,
  onEdit,
  onCancel,
}: AdvanceHistoryMobileCardProps) {
  const deductedAmount = advance.amount - advance.remainingAmount;

  const config = statusConfig[advance.status] ?? statusConfig.cancelled;

  const canModify =
    advance.status === "active" && advance.remainingAmount === advance.amount;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* ========================================================= */}
      {/* Header */}
      {/* ========================================================= */}
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <UserRound className="h-4 w-4 text-slate-500" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {getEmployeeName(advance)}
                </h3>

                {typeof advance.employee !== "string" &&
                  advance.employee.fatherName && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {advance.employee.fatherName}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${config.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />

            {config.label}
          </span>
        </div>
      </div>
      {/* ========================================================= */}
      {/* Financial Summary */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 gap-px bg-slate-100">
        <div className="bg-white p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Advance
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatCurrency(advance.amount)}
          </p>
        </div>

        <div className="bg-white p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Remaining
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatCurrency(advance.remainingAmount)}
          </p>
        </div>

        <div className="bg-white p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Deducted
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {formatCurrency(deductedAmount)}
          </p>
        </div>

        <div className="bg-white p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Date
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

            <p className="text-sm font-medium text-slate-700">
              {formatDate(advance.advanceDate)}
            </p>
          </div>
        </div>
      </div>
      {/* ========================================================= */}
      {/* Description */}
      {/* ========================================================= */}
      {advance.description && (
        <div className="border-t border-slate-100 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Description
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {advance.description}
          </p>
        </div>
      )}
      {/* ========================================================= */}
      {/* Footer */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400">Created by</p>

          <p className="truncate text-xs font-medium text-slate-700">
            {getCreatedBy(advance)}
          </p>
        </div>

        {canEdit && canModify && (
          <div className="flex shrink-0 gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(advance)}
                aria-label="Edit advance"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}

            {onCancel && (
              <button
                type="button"
                onClick={() => onCancel(advance)}
                aria-label="Cancel advance"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 active:scale-95"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
