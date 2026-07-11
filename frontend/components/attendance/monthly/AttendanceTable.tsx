import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceMonth,
} from "@/types/attendance";

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
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">No employees found.</p>
      </div>
    );
  }

  // ======================================
  // DAYS
  // ======================================

  const days = Array.from({ length: month.days }, (_, index) => index + 1);

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-max border-collapse">
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
    </div>
  );
}
