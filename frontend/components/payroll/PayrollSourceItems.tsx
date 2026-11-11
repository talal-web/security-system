import { Card, CardHeader } from "@/components/ui/Card";
import type { PayrollItem } from "@/types/payroll";

export default function PayrollSourceItems({
  title,
  items,
}: {
  title: string;
  items: PayrollItem[];
}) {
  if (!items.length) return null;
  return (
    <Card className="overflow-hidden">
      <CardHeader title={title} />
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={item.source}
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm sm:px-5"
          >
            <span className="min-w-0 truncate font-mono text-xs text-slate-500">
              {item.source}
            </span>
            <span className="shrink-0 text-right font-medium tabular-nums text-slate-900">
              Rs. {item.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
