"use client";

import { Plus } from "lucide-react";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
            Employee Advances
          </h1>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Manage and review employee advance records.
          </p>
        </div>

        {/* Actions */}
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
              className="inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98] sm:h-10 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add Advance</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
