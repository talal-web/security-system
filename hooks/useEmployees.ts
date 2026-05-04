// src/hooks/useEmployees.ts

"use client";

import { useEffect, useState } from "react";

import { Employee } from "@/types/employee";
import { getEmployees } from "@/services/employeeService";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);

        const data = await getEmployees();

        setEmployees(data);
      } catch (err) {
        console.error("Fetch Employees Error:", err);

        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
  };
}
