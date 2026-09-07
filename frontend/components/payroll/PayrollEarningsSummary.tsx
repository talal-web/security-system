import { CircleDollarSign } from "lucide-react";
import type { Payroll } from "@/types/payroll";

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;
export default function PayrollEarningsSummary({
  payroll,
}: {
  payroll: Payroll;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="h-5 w-5 text-emerald-600" />
        <h2 className="font-semibold text-slate-900">Earnings</h2>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Monthly salary</dt>
          <dd className="font-medium text-slate-900">
            {money(payroll.monthlySalary)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Daily rate</dt>
          <dd className="font-medium text-slate-900">
            {money(payroll.salaryPerDay)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Earned salary</dt>
          <dd className="font-medium text-slate-900">
            {money(payroll.earnedSalary)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Bonuses</dt>
          <dd className="font-medium text-emerald-700">
            +{money(payroll.totalBonus)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Gross salary</dt>
          <dd className="font-bold text-slate-900">
            {money(payroll.grossSalary)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
