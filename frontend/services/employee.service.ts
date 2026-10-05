import api from "@/lib/axios";
import {
  Employee,
  EmployeeFilters,
  EmployeeLookupResult,
} from "@/types/employee";
import { getApiErrorMessage } from "@/lib/apiError";
import { ApiError, getApiErrorStatus } from "@/lib/apiError";

export async function lookupEmployee(
  empId: string,
  areaId: string,
): Promise<EmployeeLookupResult> {
  try {
    const res = await api.get("/employees/lookup", {
      params: { empId, area: areaId },
    });

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

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

export async function getEmployeeById(
  id: string,
  areaId: string,
): Promise<Employee> {
  try {
    const res = await api.get(`/employees/${id}`, {
      params: { area: areaId },
    });

    return res.data.data;
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}

export async function createEmployee(
  employeeData: FormData,
  areaId: string,
): Promise<Employee> {
  try {
    employeeData.set("area", areaId);
    const res = await api.post("/employees", employeeData, {
      params: { area: areaId },
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
  areaId: string,
): Promise<Employee> {
  try {
    employeeData.set("area", areaId);
    const res = await api.put(`/employees/${id}`, employeeData, {
      params: { area: areaId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    throw new ApiError(
      getApiErrorMessage(error),
      getApiErrorStatus(error),
    );
  }
}

export async function deleteEmployee(
  id: string,
  areaId: string,
): Promise<void> {
  try {
    await api.delete(`/employees/${id}`, { params: { area: areaId } });
  } catch (error) {
    const message = getApiErrorMessage(error);

    throw new Error(message);
  }
}
