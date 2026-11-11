import { Banknote, CircleCheck, FileText, Users } from "lucide-react";
import { StatCard, type StatTone } from "@/components/ui/StatCard";
import type { Payroll } from "@/types/payroll";

const money = (value: number) => `Rs. ${value.toLocaleString()}`;
export default function PayrollSummary({ payrolls }: { payrolls: Payroll[] }) {
  const total = payrolls.reduce((sum, payroll) => sum + payroll.netSalary, 0);
  const paid = payrolls.filter((payroll) => payroll.status === "paid").length;
  const draft = payrolls.filter((payroll) => payroll.status === "draft").length;
  const items: [string, string, typeof Banknote, StatTone][] = [
    ["Net payroll", money(total), Banknote, "emerald"],
    ["Paid", String(paid), CircleCheck, "blue"],
    ["Draft", String(draft), FileText, "amber"],
    ["Employees", String(payrolls.length), Users, "slate"],
  ];
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map(([label, value, Icon, tone]) => (
        <StatCard key={label} label={label} value={value} icon={Icon} tone={tone} />
      ))}
    </section>
  );
}
