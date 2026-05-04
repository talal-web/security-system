// src/hooks/useCreateEmployee.ts

"use client";

import { useState } from "react";

import { Employee } from "@/types/employee";

import { createEmployee } from "@/services/employeeService";

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCreateEmployee = async (employeeData: Partial<Employee>) => {
    try {
      setLoading(true);

      setSuccess("");
      setError("");

      const data = await createEmployee(employeeData);

      setSuccess("Employee created successfully");

      return data;
    } catch (err) {
      console.error(err);

      setError("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreateEmployee,
    loading,
    success,
    error,
  };
}
