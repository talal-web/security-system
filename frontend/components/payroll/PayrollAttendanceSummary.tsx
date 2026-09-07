import { CalendarCheck2 } from "lucide-react";
import type { Payroll } from "@/types/payroll";

export default function PayrollAttendanceSummary({
  payroll,
}: {
  payroll: Payroll;
}) {
  const rows = [
    ["Present", payroll.presentDays, "text-emerald-700"],
    ["Leave", payroll.leaveDays, "text-blue-700"],
    ["Absent", payroll.absentDays, "text-red-700"],
    ["Missing", payroll.missingDays, "text-amber-700"],
  ] as const;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarCheck2 className="h-5 w-5 text-emerald-600" />
        <h2 className="font-semibold text-slate-900">Attendance</h2>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {rows.map(([label, days, color]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-1 text-lg font-bold ${color}`}>{days} days</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
        Paid days:{" "}
        <span className="font-semibold text-slate-900">
          {payroll.payableDays} of {payroll.calendarDays}
        </span>
      </p>
    </section>
  );
}
