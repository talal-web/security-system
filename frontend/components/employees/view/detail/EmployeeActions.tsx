"use client";

import Link from "next/link";
import { Pencil, FileSpreadsheet } from "lucide-react";

import DeleteEmployeeButton from "./DeleteEmployeeButton";

import { exportEmployeeBioData } from "@/utils/export/EmployeeBioData";
import { Employee } from "@/types/employee";

interface EmployeeActionsProps {
  employee: Employee;
}

export default function EmployeeActions({ employee }: EmployeeActionsProps) {
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        {/* Edit */}
        <Link
          href={`/employees/${employee._id}/edit`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:shadow-lg sm:w-auto"
        >
          <Pencil className="h-4 w-4" />
          Edit Employee
        </Link>

        {/* Export */}
        <button
          type="button"
          onClick={() =>
            exportEmployeeBioData({
              employee,
              title: `${employee.empId} - Bio Data`,
            })
          }
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg sm:w-auto"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </button>

        {/* Delete */}
        <div className="w-full sm:w-auto">
          <DeleteEmployeeButton employeeId={employee._id} />
        </div>
      </div>
    </div>
  );
}
