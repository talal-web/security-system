"use client";

import { formatMoney } from "@/components/bank/format";
import type { BankYearMonth } from "@/types/bank";

interface BankYearChartProps {
  months: BankYearMonth[];
  activeMonth: string; // "YYYY-MM"
  onSelect: (month: string) => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const shortName = (key: string) => MONTH_NAMES[Number(key.slice(5, 7)) - 1];

/** Income vs. money out per month, drawn with plain divs (no chart library). */
export default function BankYearChart({ months, activeMonth, onSelect }: BankYearChartProps) {
  const peak = Math.max(1, ...months.flatMap((m) => [m.income, m.outflows]));

  if (months.length === 0) {
    return <p className="text-sm text-slate-500">No months to show for this year.</p>;
  }

  return (
    <div>
      <div className="flex h-44 items-end gap-2 sm:gap-3">
        {months.map((m) => {
          const incomeHeight = (m.income / peak) * 100;
          const outHeight = (m.outflows / peak) * 100;
          const active = m.month === activeMonth;

          return (
            <button
              key={m.month}
              type="button"
              onClick={() => onSelect(m.month)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-1 pb-1 pt-2 transition hover:bg-slate-50 ${
                active ? "bg-blue-50 ring-1 ring-blue-200" : ""
              }`}
              title={`${m.month}: in ${formatMoney(m.income)}, out ${formatMoney(m.outflows)}, closing ${formatMoney(m.closing)}`}
            >
              <div className="flex h-36 w-full items-end justify-center gap-1">
                <div
                  className="w-1/2 max-w-3 rounded-t bg-emerald-500"
                  style={{ height: `${incomeHeight}%` }}
                />
                <div
                  className="w-1/2 max-w-3 rounded-t bg-red-400"
                  style={{ height: `${outHeight}%` }}
                />
              </div>
              <span className={`text-xs ${active ? "font-semibold text-blue-700" : "text-slate-500"}`}>
                {shortName(m.month)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-500" /> Money in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-red-400" /> Money out
        </span>
      </div>
    </div>
  );
}
