import { MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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
    <Card>
      <CardHeader title="Deductions" icon={MinusCircle} />
      <CardContent>
        <dl className="space-y-3 text-sm">
          {rows.map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-medium tabular-nums text-red-700">
                -{money(amount)}
              </dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
            <dt className="font-semibold text-slate-900">Total deductions</dt>
            <dd className="text-right font-semibold tabular-nums text-red-700">
              -{money(payroll.totalDeductions)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
