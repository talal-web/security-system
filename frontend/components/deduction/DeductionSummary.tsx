"use client";

import { ArrowDownLeft, CheckCircle2, ClipboardMinus } from "lucide-react";

import type { Deduction } from "@/types/deduction";

interface DeductionSummaryProps {
  deductions: Deduction[];
}

export default function DeductionSummary({
  deductions,
}: DeductionSummaryProps) {
  const outstandingDeductions = deductions.filter(
    (deduction) =>
      deduction.status === "pending" ||
      deduction.status === "partially_deducted",
  );

  const totalOutstanding = outstandingDeductions.reduce(
    (total, deduction) => total + deduction.remainingAmount,
    0,
  );

  const totalDeducted = deductions.reduce(
    (total, deduction) =>
      total + (deduction.amount - deduction.remainingAmount),
    0,
  );

  const summary = [
    {
      label: "Total Deductions",
      value: deductions.length.toLocaleString(),
      description: `${outstandingDeductions.length} outstanding`,
      icon: ClipboardMinus,
      iconWrapper: "bg-slate-100 text-slate-600",
    },
    {
      label: "Outstanding",
      value: `Rs. ${totalOutstanding.toLocaleString()}`,
      description:
        outstandingDeductions.length > 0
          ? `${outstandingDeductions.length} pending record${
              outstandingDeductions.length !== 1 ? "s" : ""
            }`
          : "No outstanding balance",
      icon: ArrowDownLeft,
      iconWrapper: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Deducted",
      value: `Rs. ${totalDeducted.toLocaleString()}`,
      description: "Recovered through payroll",
      icon: CheckCircle2,
      iconWrapper: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section
      aria-label="Deduction summary"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconWrapper}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
