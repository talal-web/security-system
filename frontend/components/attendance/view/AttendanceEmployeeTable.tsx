"use client";

import { UserX } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import type { AttendanceStatus } from "@/types/attendance";
import type { AttendanceReportAbsentLeaveEmployee } from "@/types/attendance-report";

interface AttendanceEmployeeTableProps {
  title: string;
  status: AttendanceStatus;
  employees: AttendanceReportAbsentLeaveEmployee[];
}

export default function AttendanceEmployeeTable({
  title,
  status,
  employees,
}: AttendanceEmployeeTableProps) {
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const statusTone =
    status === "absent" ? "danger" : status === "leave" ? "warning" : "neutral";

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader
        icon={UserX}
        title={title}
        description={`${employees.length} Employee${employees.length !== 1 ? "s" : ""}`}
        actions={
          <Badge tone={statusTone} dot>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        }
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-sm">
          <thead className="bg-slate-50/80 text-left text-xs font-medium text-slate-500">
            <tr>
              <th scope="col" className="w-16 px-4 py-3 text-center">
                #
              </th>
              <th scope="col" className="px-4 py-3">
                Emp ID
              </th>
              <th scope="col" className="px-4 py-3">
                Employee Name
              </th>
              <th scope="col" className="px-4 py-3">
                Father Name
              </th>
              <th scope="col" className="px-4 py-3">
                Designation
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Remarks
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.map((employee, index) => (
              <tr
                key={employee.attendanceId}
                className="transition-colors hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 text-center text-slate-500 tabular-nums">
                  {index + 1}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {employee.empId}
                </td>

                <td className="px-4 py-3 font-medium text-slate-900">
                  {employee.name}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {employee.fatherName}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {("designation" in employee && employee.designation) || "-"}
                </td>

                <td className="px-4 py-3">
                  <Badge tone={statusTone}>{statusLabel}</Badge>
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {employee.remarks || "-"}
                </td>

                <td className="px-4 py-3 text-slate-600 tabular-nums">
                  {new Date(employee.date).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <ButtonLink
                    href={`/attendance/${employee.attendanceId}`}
                    variant="secondary"
                    size="sm"
                  >
                    View
                  </ButtonLink>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
