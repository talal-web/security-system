import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceMonth,
} from "@/types/attendance";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

import MonthlyAttendanceHeader from "./AttendanceHeader";
import MonthlyAttendanceRow from "./AttendanceRow";

interface MonthlyAttendanceTableProps {
  month: MonthlyAttendanceMonth;
  employees: MonthlyAttendanceEmployee[];
}

export default function MonthlyAttendanceTable({
  month,
  employees,
}: MonthlyAttendanceTableProps) {
  // ======================================
  // EMPTY STATE
  // ======================================

  if (employees.length === 0) {
    return (
      <EmptyState title="No employees found." />
    );
  }

  // ======================================
  // DAYS
  // ======================================

  const days = Array.from({ length: month.days }, (_, index) => index + 1);

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-max border-collapse text-sm">
          <MonthlyAttendanceHeader days={days} />

          <tbody>
            {employees.map((employee) => (
              <MonthlyAttendanceRow
                key={employee.employeeId}
                employee={employee}
                days={days}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
