"use client";

import Link from "next/link";
import PayrollCard from "./PayrollCard";
import PayrollActions from "./PayrollActions";
import PayrollStatusBadge from "./PayrollStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import type { Payroll } from "@/types/payroll";
import { useSelectedArea } from "@/components/area/AreaContext";

const name = (payroll: Payroll) =>
  typeof payroll.employee === "string" ? "Employee" : payroll.employee.name;
const empId = (payroll: Payroll) =>
  typeof payroll.employee === "string" ? "" : payroll.employee.empId;
export default function PayrollTable({
  payrolls,
  canManage = false,
}: {
  payrolls: Payroll[];
  canManage?: boolean;
}) {
  const { getAreaAwareHref } = useSelectedArea();

  if (!payrolls.length)
    return (
      <EmptyState
        title="No payroll records found"
        description="Generate payroll for an employee or adjust the filters."
      />
    );
  return (
    <>
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-left text-xs font-medium text-slate-500">
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 text-right font-medium">Payable days</th>
                <th className="px-4 py-3 text-right font-medium">Net salary</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrolls.map((payroll) => (
                <tr key={payroll._id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={getAreaAwareHref(`/payroll/${payroll._id}`)}
                      className="font-medium text-slate-900 hover:text-blue-700"
                    >
                      {name(payroll)}
                      <span className="mt-0.5 block text-xs font-normal text-slate-500">
                        {empId(payroll)}
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {new Date(payroll.year, payroll.month - 1).toLocaleString(
                      "en",
                      { month: "short", year: "numeric" },
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                    {payroll.payableDays}/{payroll.calendarDays}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                    Rs. {payroll.netSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <PayrollStatusBadge status={payroll.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ButtonLink
                        href={getAreaAwareHref(`/payroll/${payroll._id}`)}
                        variant="secondary"
                        size="sm"
                      >
                        View details
                      </ButtonLink>
                      <PayrollActions payroll={payroll} canManage={canManage} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="space-y-3 md:hidden">
        {payrolls.map((payroll) => (
          <PayrollCard
            key={payroll._id}
            payroll={payroll}
            canManage={canManage}
          />
        ))}
      </div>
    </>
  );
}
