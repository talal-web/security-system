"use client";

import { CheckCircle2, Clock3, Gift } from "lucide-react";

import { StatCard, type StatTone } from "@/components/ui/StatCard";

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

  const summary: {
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    tone: StatTone;
  }[] = [
    {
      label: "Total Bonuses",
      value: bonuses.length.toLocaleString(),
      description: `${pendingBonuses.length} pending`,
      icon: Gift,
      tone: "slate",
    },
    {
      label: "Pending",
      value: pendingBonuses.length.toLocaleString(),
      description:
        pendingBonuses.length > 0 ? "Awaiting payroll" : "No pending bonuses",
      icon: Clock3,
      tone: "amber",
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
      tone: "emerald",
    },
  ];

  return (
    <section
      aria-label="Bonus summary"
      className="grid grid-cols-2 gap-3 lg:grid-cols-3"
    >
      {summary.map((item, index) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          hint={item.description}
          icon={item.icon}
          tone={item.tone}
          className={
            index === summary.length - 1 ? "col-span-2 lg:col-span-1" : ""
          }
        />
      ))}
    </section>
  );
}
