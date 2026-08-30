"use client";

import { Plus, WalletCards, ArrowUpRight } from "lucide-react";

import AdvanceExportButton from "@/components/advance/AdvanceExportButton";

import type { Advance, AdvanceFilters } from "@/types/advance";

interface AdvanceHeaderProps {
  advances: Advance[];
  filters: AdvanceFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function AdvanceHeader({
  advances,
  filters,
  canEdit,
  onAdd,
}: AdvanceHeaderProps) {
  return (
    <header>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* =====================================================
            Title
        ====================================================== */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-inset ring-blue-100 sm:flex">
            <WalletCards className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
                Employee Advances
              </h1>

              {/* Record count */}
              <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 sm:inline-flex">
                {advances.length} {advances.length === 1 ? "Record" : "Records"}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Manage employee advances, repayments, and outstanding balances.
            </p>
          </div>
        </div>

        {/* =====================================================
            Actions
        ====================================================== */}
        <div
          className={`grid w-full gap-2 sm:flex sm:w-auto ${
            canEdit ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Export */}
          <div className="min-w-0">
            <AdvanceExportButton advances={advances} filters={filters} />
          </div>

          {/* Add Advance */}
          {canEdit && (
            <button
              type="button"
              onClick={onAdd}
              className="group inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm shadow-blue-600/10 transition-all duration-150 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/15 active:scale-[0.97] sm:h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:rotate-90" />

              <span className="truncate">Add Advance</span>

              <ArrowUpRight className="hidden h-3.5 w-3.5 shrink-0 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70 sm:block" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
