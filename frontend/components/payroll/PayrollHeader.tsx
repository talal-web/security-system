"use client";

import { CalendarPlus, WalletCards } from "lucide-react";

import PayrollExportButton from "./PayrollExportButton";
import RecalculateMonthlyPayrollButton from "./RecalculateMonthlyPayrollButton";
import type { Payroll, PayrollFilters } from "@/types/payroll";

interface PayrollHeaderProps {
  count: number;
  canManage: boolean;
  payrolls: Payroll[];
  filters: PayrollFilters;
  onGenerate: () => void;
  onGenerateMonth: () => void;
}

export default function PayrollHeader({
  count,
  canManage,
  payrolls,
  filters,
  onGenerate,
  onGenerateMonth,
}: PayrollHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 sm:flex">
          <WalletCards className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Payroll
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {count} payroll record{count === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <div
        className={`grid gap-2 sm:flex ${canManage ? "grid-cols-2" : "grid-cols-1"}`}
      >
        <PayrollExportButton payrolls={payrolls} filters={filters} />
        {canManage && (
          <>
            <RecalculateMonthlyPayrollButton
              year={filters.year}
              month={filters.month}
            />
            <button
              type="button"
              onClick={onGenerate}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Generate employee
            </button>
            <button
              type="button"
              onClick={onGenerateMonth}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <CalendarPlus className="h-4 w-4" />
              Generate month
            </button>
          </>
        )}
      </div>
    </header>
  );
}
