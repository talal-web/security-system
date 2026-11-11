import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceStatus,
} from "@/types/attendance";

import { formatText } from "@/utils/employee/employeeFormat";

interface MonthlyAttendanceRowProps {
  employee: MonthlyAttendanceEmployee;
  days: number[];
}

function getStatusClasses(status: MonthlyAttendanceStatus) {
  switch (status) {
    case "P":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "L":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "A":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-slate-50 text-slate-400 ring-slate-500/10";
  }
}

const stickyTd =
  "sticky z-30 border border-slate-200 bg-white px-3 py-2 whitespace-nowrap";

const summaryTd =
  "border border-slate-200 bg-slate-50/80 px-3 py-2 text-center font-semibold tabular-nums";

export default function MonthlyAttendanceRow({
  employee,
  days,
}: MonthlyAttendanceRowProps) {
  return (
    <tr className="hover:bg-slate-50/60">
      {/* ====================================== */}
      {/* STICKY EMPLOYEE INFO */}
      {/* ====================================== */}

      <td className={`${stickyTd} left-0 font-mono text-xs text-slate-600`}>
        {employee.empId}
      </td>

      <td className={`${stickyTd} left-22.5 font-medium text-slate-900`}>
        {employee.name}
      </td>

      <td className={`${stickyTd} left-67.5 text-slate-600`}>
        {employee.fatherName}
      </td>

      <td className={`${stickyTd} left-112.5 text-slate-600`}>
        {formatText(employee.designation?.replace(/_/g, " "))}
      </td>

      {/* ====================================== */}
      {/* DAILY ATTENDANCE */}
      {/* ====================================== */}

      {days.map((day) => {
        const status = employee.attendance[day] ?? "-";

        return (
          <td key={day} className="border border-slate-200 p-2 text-center">
            <span
              className={`inline-flex size-7 items-center justify-center rounded-md text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                status,
              )}`}
            >
              {status}
            </span>
          </td>
        );
      })}

      {/* ====================================== */}
      {/* SUMMARY */}
      {/* ====================================== */}

      <td className={`${summaryTd} text-emerald-700`}>
        {employee.summary.present}
      </td>

      <td className={`${summaryTd} text-amber-700`}>
        {employee.summary.leave}
      </td>

      <td className={`${summaryTd} text-red-700`}>
        {employee.summary.absent}
      </td>

      <td className={`${summaryTd} text-slate-900`}>
        {employee.summary.total}
      </td>
    </tr>
  );
}
