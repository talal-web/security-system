"use client";

import { ChevronRight, Eye } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import PayrollActions from "./PayrollActions";
import PayrollStatusBadge from "./PayrollStatusBadge";
import type { Payroll } from "@/types/payroll";
import { useSelectedArea } from "@/components/area/AreaContext";

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
  const { getAreaAwareHref } = useSelectedArea();

  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">
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
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Net salary</p>
          <p className="text-lg font-semibold tracking-tight tabular-nums text-slate-900">
            Rs. {payroll.netSalary.toLocaleString()}
          </p>
        </div>
        <ButtonLink
          href={getAreaAwareHref(`/payroll/${payroll._id}`)}
          variant="secondary"
          size="sm"
        >
          <Eye />
          View details
          <ChevronRight />
        </ButtonLink>
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <PayrollActions payroll={payroll} canManage={canManage} />
      </div>
    </article>
  );
}
