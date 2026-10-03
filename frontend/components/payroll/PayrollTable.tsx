"use client";

import Link from "next/link";
import PayrollCard from "./PayrollCard";
import PayrollActions from "./PayrollActions";
import PayrollStatusBadge from "./PayrollStatusBadge";
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
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <p className="font-semibold text-slate-700">No payroll records found</p>
        <p className="mt-1 text-sm text-slate-500">
          Generate payroll for an employee or adjust the filters.
        </p>
      </div>
    );
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Employee</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Payable days</th>
              <th className="px-4 py-3">Net salary</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrolls.map((payroll) => (
              <tr key={payroll._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <Link
                    href={getAreaAwareHref(`/payroll/${payroll._id}`)}
                    className="font-semibold text-slate-900 hover:text-emerald-700"
                  >
                    {name(payroll)}
                    <span className="mt-0.5 block text-xs font-normal text-slate-500">
                      {empId(payroll)}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {new Date(payroll.year, payroll.month - 1).toLocaleString(
                    "en",
                    { month: "short", year: "numeric" },
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {payroll.payableDays}/{payroll.calendarDays}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  Rs. {payroll.netSalary.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <PayrollStatusBadge status={payroll.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={getAreaAwareHref(`/payroll/${payroll._id}`)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View details
                    </Link>
                    <PayrollActions payroll={payroll} canManage={canManage} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
