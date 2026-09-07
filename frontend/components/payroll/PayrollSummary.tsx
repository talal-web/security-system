import { Banknote, CircleCheck, FileText, Users } from "lucide-react";
import type { Payroll } from "@/types/payroll";

const money = (value: number) => `Rs. ${value.toLocaleString()}`;
export default function PayrollSummary({ payrolls }: { payrolls: Payroll[] }) {
  const total = payrolls.reduce((sum, payroll) => sum + payroll.netSalary, 0);
  const paid = payrolls.filter((payroll) => payroll.status === "paid").length;
  const draft = payrolls.filter((payroll) => payroll.status === "draft").length;
  const items = [
    ["Net payroll", money(total), Banknote, "text-emerald-600 bg-emerald-50"],
    ["Paid", String(paid), CircleCheck, "text-blue-600 bg-blue-50"],
    ["Draft", String(draft), FileText, "text-amber-600 bg-amber-50"],
    [
      "Employees",
      String(payrolls.length),
      Users,
      "text-slate-600 bg-slate-100",
    ],
  ] as const;
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value, Icon, colors]) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      ))}
    </section>
  );
}
