"use client";

import {
  AlertTriangle,
  ArrowDownLeft,
  CircleDollarSign,
  Users,
} from "lucide-react";

import { StatCard, type StatTone } from "@/components/ui/StatCard";

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

  const stats: {
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    tone: StatTone;
  }[] = [
    {
      label: "Employees",
      value: uniqueEmployees.toLocaleString(),
      description: "With fines",
      icon: Users,
      tone: "slate",
    },
    {
      label: "Total Fines",
      value: formatCurrency(totalAmount),
      description: `${fines.length} record${fines.length !== 1 ? "s" : ""}`,
      icon: AlertTriangle,
      tone: "blue",
    },
    {
      label: "Outstanding",
      value: formatCurrency(totalOutstanding),
      description: `${outstandingFines.length} active`,
      icon: ArrowDownLeft,
      tone: "amber",
    },
    {
      label: "Total Deducted",
      value: formatCurrency(totalDeducted),
      description: "Recovered",
      icon: CircleDollarSign,
      tone: "emerald",
    },
  ];

  return (
    <section
      aria-label="Fine summary"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={stat.description}
          icon={stat.icon}
          tone={stat.tone}
        />
      ))}
    </section>
  );
}
