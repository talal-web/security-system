import { CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { Payroll } from "@/types/payroll";

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;
export default function PayrollEarningsSummary({
  payroll,
}: {
  payroll: Payroll;
}) {
  return (
    <Card>
      <CardHeader title="Earnings" icon={CircleDollarSign} />
      <CardContent>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Monthly salary</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              {money(payroll.monthlySalary)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Daily rate</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              {money(payroll.salaryPerDay)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Earned salary</dt>
            <dd className="text-right font-medium tabular-nums text-slate-900">
              {money(payroll.earnedSalary)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Bonuses</dt>
            <dd className="text-right font-medium tabular-nums text-emerald-700">
              +{money(payroll.totalBonus)}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
            <dt className="font-semibold text-slate-900">Gross salary</dt>
            <dd className="text-right font-semibold tabular-nums text-slate-900">
              {money(payroll.grossSalary)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
