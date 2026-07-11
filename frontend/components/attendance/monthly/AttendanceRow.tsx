import type {
  MonthlyAttendanceEmployee,
  MonthlyAttendanceStatus,
} from "@/types/attendance";

interface MonthlyAttendanceRowProps {
  employee: MonthlyAttendanceEmployee;
  days: number[];
}

function getStatusClasses(status: MonthlyAttendanceStatus) {
  switch (status) {
    case "P":
      return "bg-green-100 text-green-700";

    case "L":
      return "bg-yellow-100 text-yellow-700";

    case "A":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-500";
  }
}

export default function MonthlyAttendanceRow({
  employee,
  days,
}: MonthlyAttendanceRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      {/* ====================================== */}
      {/* STICKY EMPLOYEE INFO */}
      {/* ====================================== */}

      <td className="sticky left-0 z-30 border bg-white px-3 py-2 font-medium whitespace-nowrap">
        {employee.empId}
      </td>

      <td className="sticky left-22.5 z-30 border bg-white px-3 py-2 whitespace-nowrap">
        {employee.name}
      </td>

      <td className="sticky left-67.5 z-30 border bg-white px-3 py-2 whitespace-nowrap">
        {employee.fatherName}
      </td>

      <td className="sticky left-112.5 z-30 border bg-white px-3 py-2 whitespace-nowrap">
        {employee.designation}
      </td>

      {/* ====================================== */}
      {/* DAILY ATTENDANCE */}
      {/* ====================================== */}

      {days.map((day) => {
        const status = employee.attendance[day] ?? "-";

        return (
          <td key={day} className="border p-2 text-center">
            <span
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${getStatusClasses(
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

      <td className="border bg-green-50 px-3 py-2 text-center font-semibold">
        {employee.summary.present}
      </td>

      <td className="border bg-yellow-50 px-3 py-2 text-center font-semibold">
        {employee.summary.leave}
      </td>

      <td className="border bg-red-50 px-3 py-2 text-center font-semibold">
        {employee.summary.absent}
      </td>

      <td className="border bg-blue-50 px-3 py-2 text-center font-bold">
        {employee.summary.total}
      </td>
    </tr>
  );
}
