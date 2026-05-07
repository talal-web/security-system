"use client";

import { useEffect, useState } from "react";

import { Employee } from "@/types/employee";

import { getEmployeeById } from "@/services/employeeService";

export function useEmployeeById(id: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const data = await getEmployeeById(id);

        setEmployee(data);
      } catch (err) {
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}
