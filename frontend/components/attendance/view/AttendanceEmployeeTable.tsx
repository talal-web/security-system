"use client";

import type {
  AttendanceEmployee,
  AttendanceNonPresentEmployee,
  AttendanceStatus,
} from "@/types/attendance";

interface AttendanceEmployeeTableProps {
  title: string;
  status: AttendanceStatus;
  employees: (AttendanceEmployee | AttendanceNonPresentEmployee)[];
}

export default function AttendanceEmployeeTable({
  title,
  status,
  employees,
}: AttendanceEmployeeTableProps) {
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const getStatusStyle = () => {
    switch (status) {
      case "absent":
        return "inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700";

      case "leave":
        return "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700";

      default:
        return "inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">
            {employees.length} Employee{employees.length !== 1 && "s"}
          </p>
        </div>

        <span className={getStatusStyle()}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600">
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
            </tr>
          </thead>

          <tbody className="divide-y">
            {employees.map((employee, index) => (
              <tr
                key={employee.attendanceId}
                className="transition hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-center font-medium text-slate-600">
                  {index + 1}
                </td>

                <td className="px-4 py-3 font-medium text-slate-700">
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
                  <span className={getStatusStyle()}>{statusLabel}</span>
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {employee.remarks || "-"}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {new Date(employee.date).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
