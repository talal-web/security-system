"use client";

import { UserX } from "lucide-react";

import AttendanceAbsentLeaveCard from "./AttendanceAbsentLeaveCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import type { AttendanceFormEmployee } from "@/types/attendance-session";

interface AttendanceAbsentLeaveListProps {
  absentEmployees: AttendanceFormEmployee[];
  leaveEmployees: AttendanceFormEmployee[];
  onEmployeeChange: (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => void;
}

export default function AttendanceAbsentLeaveList({
  absentEmployees,
  leaveEmployees,
  onEmployeeChange,
}: AttendanceAbsentLeaveListProps) {
  const employees = [...absentEmployees, ...leaveEmployees];

  if (employees.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon={UserX}
        title="Absent & Leave"
        description="Employees marked absent or on leave"
        className="bg-slate-50/60"
        actions={
          <Badge tone="danger" className="tabular-nums">
            {employees.length} Employees
          </Badge>
        }
      />

      <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {employees.map((employee) => (
          <AttendanceAbsentLeaveCard
            key={employee.employeeId}
            employee={employee}
            onUpdate={onEmployeeChange}
          />
        ))}
      </CardContent>
    </Card>
  );
}
