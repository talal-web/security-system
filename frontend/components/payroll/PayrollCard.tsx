"use client";

import Link from "next/link";
import { ChevronRight, Eye } from "lucide-react";
import PayrollActions from "./PayrollActions";
import PayrollStatusBadge from "./PayrollStatusBadge";
import type { Payroll } from "@/types/payroll";

const employeeName = (payroll: Payroll) =>
  typeof payroll.employee === "string" ? "Employee" : payroll.employee.name;
const employeeId = (payroll: Payroll) =>
  typeof payroll.employee === "string" ? "" : payroll.employee.empId;
export default function PayrollCard({
  payroll,
  canManage = false,
}: {
  payroll: Payroll;
  canManage?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">
            {employeeName(payroll)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {employeeId(payroll)} ·{" "}
            {new Date(payroll.year, payroll.month - 1).toLocaleString("en", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <PayrollStatusBadge status={payroll.status} />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500">Net salary</p>
          <p className="text-lg font-bold text-slate-900">
            Rs. {payroll.netSalary.toLocaleString()}
          </p>
        </div>
        <Link
          href={`/payroll/${payroll._id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" />
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <PayrollActions payroll={payroll} canManage={canManage} />
      </div>
    </article>
  );
}
