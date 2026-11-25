"use client";

import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import { formatMoney } from "@/components/bank/format";
import type { BankMonthReport } from "@/types/bank";

interface BankMonthSummaryProps {
  report: BankMonthReport | undefined;
  loading?: boolean;
}

const OUTFLOW_LABELS: Record<keyof BankMonthReport["totals"]["outflows"], string> = {
  rent: "Rent",
  expense: "Expenses",
  advance: "Advances",
  salary: "Salaries (cash)",
};

export default function BankMonthSummary({ report, loading }: BankMonthSummaryProps) {
  const totals = report?.totals;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Opening balance"
          value={report ? formatMoney(report.opening) : "-"}
          hint="Start of the month"
          icon={Wallet}
          tone="slate"
          loading={loading}
        />
        <StatCard
          label="Money in"
          value={totals ? formatMoney(totals.income) : "-"}
          hint="Income received this month"
          icon={ArrowDownCircle}
          tone="emerald"
          loading={loading}
        />
        <StatCard
          label="Money out"
          value={totals ? formatMoney(totals.totalOutflows) : "-"}
          hint="Rent, expenses, advances and salaries"
          icon={ArrowUpCircle}
          tone="red"
          loading={loading}
        />
        <StatCard
          label="Closing balance"
          value={report ? formatMoney(report.closing) : "-"}
          hint={report ? `Result this month: ${formatMoney(totals!.net)}` : undefined}
          icon={Wallet}
          tone="blue"
          loading={loading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900">Spending this month</h3>
          <dl className="mt-3 divide-y divide-slate-100 text-sm">
            {totals &&
              (Object.keys(OUTFLOW_LABELS) as (keyof typeof OUTFLOW_LABELS)[]).map((key) => (
                <div key={key} className="flex justify-between py-2">
                  <dt className="text-slate-600">{OUTFLOW_LABELS[key]}</dt>
                  <dd className="font-medium text-slate-900">
                    {formatMoney(totals.outflows[key])}
                  </dd>
                </div>
              ))}
            {!totals && <p className="py-2 text-slate-500">No data yet.</p>}
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center gap-2">
            <PiggyBank className="size-4 text-violet-600" />
            <h3 className="text-sm font-semibold text-slate-900">Savings</h3>
          </div>
          <dl className="mt-3 divide-y divide-slate-100 text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-slate-600">Moved to savings this month</dt>
              <dd className="font-medium text-slate-900">
                {totals ? formatMoney(totals.savingsDeposited) : "-"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-600">Taken from savings this month</dt>
              <dd className="font-medium text-slate-900">
                {totals ? formatMoney(totals.savingsWithdrawn) : "-"}
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium text-slate-900">Total saved so far</dt>
              <dd className="font-semibold text-violet-700">
                {report ? formatMoney(report.savingsBalance) : "-"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
