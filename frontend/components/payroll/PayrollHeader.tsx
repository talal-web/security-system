"use client";

import { CalendarPlus, WalletCards } from "lucide-react";

import PayrollExportButton from "./PayrollExportButton";
import RecalculateMonthlyPayrollButton from "./RecalculateMonthlyPayrollButton";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <PageHeader
      title="Payroll"
      icon={WalletCards}
      description={`${count} payroll record${count === 1 ? "" : "s"}`}
      actions={
        <>
          <PayrollExportButton payrolls={payrolls} filters={filters} />
          {canManage && (
            <>
              <RecalculateMonthlyPayrollButton
                year={filters.year}
                month={filters.month}
              />
              <Button variant="secondary" onClick={onGenerate}>
                Generate employee
              </Button>
              <Button onClick={onGenerateMonth}>
                <CalendarPlus />
                Generate month
              </Button>
            </>
          )}
        </>
      }
    />
  );
}
