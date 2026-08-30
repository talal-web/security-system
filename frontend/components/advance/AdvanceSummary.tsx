"use client";

import {
  ArrowDownLeft,
  CircleDollarSign,
  CreditCard,
  Users,
} from "lucide-react";

import type { Advance } from "@/types/advance";

interface AdvanceSummaryProps {
  advances: Advance[];
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

export default function AdvanceSummary({ advances }: AdvanceSummaryProps) {
  const activeAdvances = advances.filter(
    (advance) =>
      advance.status === "active" || advance.status === "partially_deducted",
  );

  const uniqueEmployees = new Set(
    advances.map((advance) =>
      typeof advance.employee === "string"
        ? advance.employee
        : advance.employee._id,
    ),
  ).size;

  const totalAmount = advances.reduce(
    (total, advance) => total + advance.amount,
    0,
  );

  const totalDeducted = advances.reduce(
    (total, advance) => total + (advance.amount - advance.remainingAmount),
    0,
  );

  const totalOutstanding = activeAdvances.reduce(
    (total, advance) => total + advance.remainingAmount,
    0,
  );

  const stats = [
    {
      label: "Employees",
      value: uniqueEmployees.toLocaleString(),
      description: "With advances",
      icon: Users,
      iconWrapper: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total Advances",
      value: formatCurrency(totalAmount),
      description: `${advances.length} record${
        advances.length !== 1 ? "s" : ""
      }`,
      icon: CreditCard,
      iconWrapper: "bg-blue-50 text-blue-600",
    },
    {
      label: "Outstanding",
      value: formatCurrency(totalOutstanding),
      description: `${activeAdvances.length} active`,
      icon: ArrowDownLeft,
      iconWrapper: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Deducted",
      value: formatCurrency(totalDeducted),
      description: "Recovered",
      icon: CircleDollarSign,
      iconWrapper: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section
      aria-label="Advance summary"
      className="grid grid-cols-2 gap-1.5 sm:gap-2.5 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="min-w-0 rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:shadow-md sm:rounded-2xl sm:p-4"
          >
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              {/* Content */}
              <div className="min-w-0">
                <p className="truncate text-[9px] font-medium text-slate-500 sm:text-xs">
                  {stat.label}
                </p>

                <p className="mt-0.5 truncate text-xs font-bold tracking-tight text-slate-900 sm:mt-1 sm:text-lg">
                  {stat.value}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-slate-400 sm:text-[11px]">
                  {stat.description}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 sm:rounded-xl ${stat.iconWrapper}`}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
