import { CalendarCheck2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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
    <Card>
      <CardHeader title="Attendance" icon={CalendarCheck2} />
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {rows.map(([label, days, color]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"
            >
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>
                {days} days
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
          Paid days:{" "}
          <span className="font-semibold tabular-nums text-slate-900">
            {payroll.payableDays} of {payroll.calendarDays}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
