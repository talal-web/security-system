"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import EmployeeProfileCard from "@/components/employees/EmployeePrint";

import { Employee } from "@/types/employee";

import { getEmployeeById } from "@/services/employee.service";

export default function EmployeePrintPage() {
  const params = useParams();

  const id = params?.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);

  // FETCH EMPLOYEE
  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true);

        const data = await getEmployeeById(id);

        setEmployee(data);
      } catch (error) {
        console.error("FAILED TO FETCH EMPLOYEE:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEmployee();
    }
  }, [id]);
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  // NOT FOUND
  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-medium">
        Employee not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 print:p-0">
      <EmployeeProfileCard employee={employee} />
    </div>
  );
}
