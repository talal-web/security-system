import PayrollStatusBadge from "./PayrollStatusBadge";
import PayrollAttendanceSummary from "./PayrollAttendanceSummary";
import PayrollEarningsSummary from "./PayrollEarningsSummary";
import PayrollDeductionsSummary from "./PayrollDeductionsSummary";
import PayrollSourceItems from "./PayrollSourceItems";
import { Card } from "@/components/ui/Card";
import type { Payroll } from "@/types/payroll";

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;
export default function PayrollDetails({ payroll }: { payroll: Payroll }) {
  const employee =
    typeof payroll.employee === "string" ? null : payroll.employee;
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">
              {new Date(payroll.year, payroll.month - 1).toLocaleString("en", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {employee?.name ?? "Employee payroll"}
            </h1>
            {employee && (
              <p className="mt-1 text-sm text-slate-500">
                {employee.empId} · {employee.designation || "No designation"}
              </p>
            )}
          </div>
          <div>
            <PayrollStatusBadge status={payroll.status} />
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-500">Period</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {new Date(payroll.periodStart).toLocaleDateString()} -{" "}
              {new Date(payroll.periodEnd).toLocaleDateString()}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-500">Net salary</dt>
            <dd className="mt-1 text-lg font-semibold tracking-tight tabular-nums text-emerald-700">
              {money(payroll.netSalary)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-500">Generated</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {new Date(payroll.generatedAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-500">Payment</dt>
            <dd className="mt-1 text-sm font-medium capitalize text-slate-900">
              {payroll.paymentMethod?.replace("_", " ") || "Not paid"}
            </dd>
          </div>
        </dl>
        {payroll.paymentReference && (
          <p className="mt-4 text-sm text-slate-500">
            Reference: {payroll.paymentReference}
          </p>
        )}
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <PayrollAttendanceSummary payroll={payroll} />
        <PayrollEarningsSummary payroll={payroll} />
        <PayrollDeductionsSummary payroll={payroll} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PayrollSourceItems
          title="Bonus source items"
          items={payroll.bonuses}
        />
        <PayrollSourceItems
          title="Advance source items"
          items={payroll.advanceDeductions}
        />
        <PayrollSourceItems
          title="Fine source items"
          items={payroll.fineDeductions}
        />
        <PayrollSourceItems
          title="Other deduction source items"
          items={payroll.otherDeductions}
        />
      </div>
    </div>
  );
}
