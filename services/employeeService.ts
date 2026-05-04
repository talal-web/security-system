// src/services/employeeService.ts

import api from "@/lib/axios";
import { Employee } from "@/types/employee";
import axios from "axios";

// ======================================
// Get All Employees
// ======================================

export async function getEmployees(): Promise<Employee[]> {
  try {
    const res = await api.get("/employees");

    console.log("API RESPONSE:", res.data);

    return res.data.data;
  } catch (error) {
    console.log("FULL ERROR:", error);

    if (axios.isAxiosError(error)) {
      console.log("AXIOS MESSAGE:", error.message);

      console.log("AXIOS STATUS:", error.response?.status);

      console.log("AXIOS DATA:", error.response?.data);

      console.log("AXIOS URL:", error.config?.url);

      console.log("AXIOS BASE URL:", error.config?.baseURL);
    }

    throw error;
  }
}

// ======================================
// Get Single Employee
// ======================================

export async function getEmployeeById(id: string): Promise<Employee> {
  try {
    const res = await api.get(`/employees/${id}`);

    return res.data.data;
  } catch (error) {
    console.error("Get Employee Error:", error);

    throw new Error("Failed to fetch employee");
  }
}

// ======================================
// Create Employee
// ======================================

export async function createEmployee(
  employeeData: Partial<Employee>,
): Promise<Employee> {
  try {
    const res = await api.post("/employees", employeeData);

    return res.data.data;
  } catch (error) {
    console.error("Create Employee Error:", error);

    throw new Error("Failed to create employee");
  }
}

// ======================================
// Update Employee
// ======================================

export async function updateEmployee(
  id: string,
  employeeData: Partial<Employee>,
): Promise<Employee> {
  try {
    const res = await api.put(`/employees/${id}`, employeeData);

    return res.data.data;
  } catch (error) {
    console.error("Update Employee Error:", error);

    throw new Error("Failed to update employee");
  }
}

// ======================================
// Delete Employee
// ======================================

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await api.delete(`/employees/${id}`);
  } catch (error) {
    console.error("Delete Employee Error:", error);

    throw new Error("Failed to delete employee");
  }
}
