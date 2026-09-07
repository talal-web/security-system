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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={item.source}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="font-mono text-xs text-slate-500">
              {item.source}
            </span>
            <span className="font-semibold text-slate-900">
              Rs. {item.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
