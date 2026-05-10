"use client";

import { useState } from "react";
import { createEmployee } from "@/services/employeeService";

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ======================================
  // CREATE EMPLOYEE (FormData supported)
  // ======================================

  const handleCreateEmployee = async (employeeData: FormData) => {
    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const data = Object.fromEntries(
        employeeData.entries(),
      ) as Partial<Employee>;

      const result = await createEmployee(data);

      setSuccess("Employee created successfully");

      return data;
    } catch (err: any) {
      console.error("HOOK ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while creating employee";

      setError(message);

      return null;
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
