"use client";

import { Plus } from "lucide-react";

import FineExportButton from "@/components/fine/FineExportButton";

import type { Fine, FineFilters } from "@/types/fine";

interface FineHeaderProps {
  fines: Fine[];
  filters: FineFilters;
  canEdit: boolean;
  onAdd: () => void;
}

export default function FineHeader({
  fines,
  filters,
  canEdit,
  onAdd,
}: FineHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
          Employee Fines
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Manage employee fines, deductions, and outstanding balances.
        </p>
      </div>

      <div
        className={`grid w-full gap-2 sm:flex sm:w-auto ${
          canEdit ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        <FineExportButton fines={fines} filters={filters} />

        {canEdit && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">Add Fine</span>
          </button>
        )}
      </div>
    </header>
  );
}
