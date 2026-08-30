"use client";

import { Plus, WalletCards } from "lucide-react";

import DeductionExportButton from "./DeductionExportButton";

import type { Deduction, DeductionFilters } from "@/types/deduction";

interface DeductionHeaderProps {
  deductions: Deduction[];
  filters: DeductionFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function DeductionHeader({
  deductions,
  filters,
  canEdit,
  onAdd,
}: DeductionHeaderProps) {
  return (
    <header>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <WalletCards className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
              Employee Deductions
            </h1>

            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Manage employee deductions, repayments, and outstanding balances.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`grid w-full gap-2 sm:flex sm:w-auto ${
            canEdit ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Export */}
          <div className="min-w-0">
            <DeductionExportButton deductions={deductions} filters={filters} />
          </div>

          {/* Add Deduction */}
          {canEdit && (
            <button
              type="button"
              onClick={onAdd}
              className="group inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:rotate-90" />

              <span className="truncate">Add Deduction</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
