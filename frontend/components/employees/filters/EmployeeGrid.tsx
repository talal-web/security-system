"use client";

import EmployeeCard from "@/components/employees/EmployeeCard";

import { Employee } from "@/types/employee";

type Props = {
  employees: Employee[];
};

export default function EmployeeGrid({ employees }: Props) {
  if (employees.length === 0) {
    return (
      <div className="flex min-h-75 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700">
            No employees found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard key={employee._id} employee={employee} />
      ))}
    </div>
  );
}
