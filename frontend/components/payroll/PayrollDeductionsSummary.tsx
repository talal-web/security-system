import { MinusCircle } from "lucide-react";
import type { Payroll } from "@/types/payroll";

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;
export default function PayrollDeductionsSummary({
  payroll,
}: {
  payroll: Payroll;
}) {
  const rows: Array<[string, number]> = [
    ["Advances", payroll.totalAdvanceDeduction],
    ["Fines", payroll.totalFineDeduction],
    ["Other deductions", payroll.totalOtherDeduction],
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <MinusCircle className="h-5 w-5 text-red-600" />
        <h2 className="font-semibold text-slate-900">Deductions</h2>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([label, amount]) => (
          <div key={label} className="flex justify-between">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-red-700">-{money(amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Total deductions</dt>
          <dd className="font-bold text-red-700">
            -{money(payroll.totalDeductions)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
