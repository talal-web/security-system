import api from "@/lib/axios";
import { Employee, EmployeeFilters } from "@/types/employee";
import { getApiErrorMessage } from "@/lib/apiError";

export async function getEmployees(
  filters?: EmployeeFilters,
): Promise<Employee[]> {
  try {
    const res = await api.get("/employees", {
      params: filters,
    });

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function getEmployeeById(id: string): Promise<Employee> {
  try {
    const res = await api.get(`/employees/${id}`);

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function createEmployee(
  employeeData: FormData,
): Promise<Employee> {
  try {
    const res = await api.post("/employees", employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function updateEmployee(
  id: string,
  employeeData: FormData,
): Promise<Employee> {
  try {
    const res = await api.put(`/employees/${id}`, employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await api.delete(`/employees/${id}`);
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}
