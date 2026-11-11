"use client";

import {
  ArrowDownLeft,
  CircleDollarSign,
  CreditCard,
  Users,
} from "lucide-react";

import { StatCard, type StatTone } from "@/components/ui/StatCard";

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
      description: "With advances",
      icon: Users,
      tone: "slate",
    },
    {
      label: "Total Advances",
      value: formatCurrency(totalAmount),
      description: `${advances.length} record${
        advances.length !== 1 ? "s" : ""
      }`,
      icon: CreditCard,
      tone: "blue",
    },
    {
      label: "Outstanding",
      value: formatCurrency(totalOutstanding),
      description: `${activeAdvances.length} active`,
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
      aria-label="Advance summary"
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
