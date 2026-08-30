"use client";

import {
  AlertTriangle,
  ArrowDownLeft,
  CircleDollarSign,
  Users,
} from "lucide-react";

import type { Fine } from "@/types/fine";

interface FineSummaryProps {
  fines: Fine[];
}

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString()}`;
}

export default function FineSummary({ fines }: FineSummaryProps) {
  const outstandingFines = fines.filter(
    (fine) => fine.status === "pending" || fine.status === "partially_deducted",
  );

  const uniqueEmployees = new Set(
    fines.map((fine) =>
      typeof fine.employee === "string" ? fine.employee : fine.employee._id,
    ),
  ).size;

  const totalAmount = fines.reduce((total, fine) => total + fine.amount, 0);

  const totalDeducted = fines.reduce(
    (total, fine) => total + (fine.amount - fine.remainingAmount),
    0,
  );

  const totalOutstanding = outstandingFines.reduce(
    (total, fine) => total + fine.remainingAmount,
    0,
  );

  const stats = [
    {
      label: "Employees",
      value: uniqueEmployees.toLocaleString(),
      description: "With fines",
      icon: Users,
      iconWrapper: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total Fines",
      value: formatCurrency(totalAmount),
      description: `${fines.length} record${fines.length !== 1 ? "s" : ""}`,
      icon: AlertTriangle,
      iconWrapper: "bg-blue-50 text-blue-600",
    },
    {
      label: "Outstanding",
      value: formatCurrency(totalOutstanding),
      description: `${outstandingFines.length} active`,
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
      aria-label="Fine summary"
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
