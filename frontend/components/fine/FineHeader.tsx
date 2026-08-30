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
    <header>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* =====================================================
            Title
        ====================================================== */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
              Employee Fines
            </h1>

            <span className="hidden rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 ring-1 ring-inset ring-red-500/10 sm:inline-flex">
              Fine Management
            </span>
          </div>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Record, monitor, and manage employee fines and their recovery
            status.
          </p>
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
            <FineExportButton fines={fines} filters={filters} />
          </div>

          {/* Add Fine */}
          {canEdit && (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98] sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add Fine</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
