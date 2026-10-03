import api from "@/lib/axios";
import {
  CreateEmployeeSalaryPayload,
  CurrentEmployeeSalaryResponse,
  EmployeeSalaryHistoryResponse,
  EmployeeSalaryResponse,
  UpdateEmployeeSalaryPayload,
} from "@/types/employeeSalary";
import {
  ApiError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/apiError";

function toSalaryApiError(error: unknown): ApiError {
  return new ApiError(getApiErrorMessage(error), getApiErrorStatus(error));
}

export async function createEmployeeSalary(
  salaryData: CreateEmployeeSalaryPayload,
  areaId: string,
): Promise<EmployeeSalaryResponse> {
  try {
    const res = await api.post("/employee-salaries", {
      ...salaryData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function getCurrentEmployeeSalary(
  employeeId: string,
  areaId: string,
): Promise<CurrentEmployeeSalaryResponse> {
  try {
    const res = await api.get(`/employee-salaries/${employeeId}/current`, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function getEmployeeSalaryHistory(
  employeeId: string,
  areaId: string,
): Promise<EmployeeSalaryHistoryResponse> {
  try {
    const res = await api.get(`/employee-salaries/${employeeId}/history`, {
      params: { area: areaId },
    });

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function updateEmployeeSalary(
  salaryId: string,
  salaryData: UpdateEmployeeSalaryPayload,
  areaId: string,
): Promise<EmployeeSalaryResponse> {
  try {
    const res = await api.patch(`/employee-salaries/${salaryId}`, {
      ...salaryData,
      area: areaId,
    });

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}
