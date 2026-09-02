"use client";

import { CheckCircle2, Clock3, Gift } from "lucide-react";

import type { Bonus } from "@/types/bonus";

interface BonusSummaryProps {
  bonuses: Bonus[];
}

export default function BonusSummary({ bonuses }: BonusSummaryProps) {
  const pendingBonuses = bonuses.filter((bonus) => bonus.status === "pending");

  const paidBonuses = bonuses.filter((bonus) => bonus.status === "paid");

  const totalPaid = paidBonuses.reduce(
    (total, bonus) => total + bonus.amount,
    0,
  );

  const summary = [
    {
      label: "Total Bonuses",
      value: bonuses.length.toLocaleString(),
      description: `${pendingBonuses.length} pending`,
      icon: Gift,
      iconWrapper: "bg-slate-100 text-slate-600",
    },
    {
      label: "Pending",
      value: pendingBonuses.length.toLocaleString(),
      description:
        pendingBonuses.length > 0 ? "Awaiting payroll" : "No pending bonuses",
      icon: Clock3,
      iconWrapper: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Paid",
      value: `Rs. ${totalPaid.toLocaleString()}`,
      description:
        paidBonuses.length > 0
          ? `${paidBonuses.length} paid record${
              paidBonuses.length !== 1 ? "s" : ""
            }`
          : "No bonuses paid yet",
      icon: CheckCircle2,
      iconWrapper: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section
      aria-label="Bonus summary"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {summary.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {item.value}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>
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
