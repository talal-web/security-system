// hooks/useUpdateEmployee.ts

"use client";

import { useState } from "react";

import { updateEmployee } from "@/services/employeeService";

import { Employee } from "@/types/employee";

export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const handleUpdateEmployee = async (
    id: string,
    employeeData: Partial<Employee>,
  ) => {
    try {
      setLoading(true);

      setError("");

      setSuccess("");

      const data = await updateEmployee(id, employeeData);

      setSuccess("Employee updated successfully.");

      return data;
    } catch (err) {
      console.error(err);

      setError("Failed to update employee.");

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateEmployee,
    loading,
    success,
    error,
  };
}
