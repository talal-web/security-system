import PayrollStatusBadge from "./PayrollStatusBadge";
import PayrollAttendanceSummary from "./PayrollAttendanceSummary";
import PayrollEarningsSummary from "./PayrollEarningsSummary";
import PayrollDeductionsSummary from "./PayrollDeductionsSummary";
import PayrollSourceItems from "./PayrollSourceItems";
import type { Payroll } from "@/types/payroll";

const money = (amount: number) => `Rs. ${amount.toLocaleString()}`;
export default function PayrollDetails({ payroll }: { payroll: Payroll }) {
  const employee =
    typeof payroll.employee === "string" ? null : payroll.employee;
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {new Date(payroll.year, payroll.month - 1).toLocaleString("en", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {employee?.name ?? "Employee payroll"}
            </h1>
            {employee && (
              <p className="mt-1 text-sm text-slate-500">
                {employee.empId} · {employee.designation || "No designation"}
              </p>
            )}
          </div>
          <PayrollStatusBadge status={payroll.status} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Period</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {new Date(payroll.periodStart).toLocaleDateString()} -{" "}
              {new Date(payroll.periodEnd).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Net salary</p>
            <p className="mt-1 text-lg font-bold text-emerald-700">
              {money(payroll.netSalary)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Generated</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {new Date(payroll.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment</p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
              {payroll.paymentMethod?.replace("_", " ") || "Not paid"}
            </p>
          </div>
        </div>
        {payroll.paymentReference && (
          <p className="mt-3 text-sm text-slate-500">
            Reference: {payroll.paymentReference}
          </p>
        )}
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        <PayrollAttendanceSummary payroll={payroll} />
        <PayrollEarningsSummary payroll={payroll} />
        <PayrollDeductionsSummary payroll={payroll} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
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
