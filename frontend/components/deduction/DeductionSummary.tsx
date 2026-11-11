"use client";

import { ArrowDownLeft, CheckCircle2, ClipboardMinus } from "lucide-react";

import { StatCard, type StatTone } from "@/components/ui/StatCard";

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

  const summary: {
    label: string;
    value: string;
    description: string;
    icon: React.ElementType;
    tone: StatTone;
  }[] = [
    {
      label: "Total Deductions",
      value: deductions.length.toLocaleString(),
      description: `${outstandingDeductions.length} outstanding`,
      icon: ClipboardMinus,
      tone: "slate",
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
      tone: "amber",
    },
    {
      label: "Total Deducted",
      value: `Rs. ${totalDeducted.toLocaleString()}`,
      description: "Recovered through payroll",
      icon: CheckCircle2,
      tone: "emerald",
    },
  ];

  return (
    <section
      aria-label="Deduction summary"
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
