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
): Promise<EmployeeSalaryResponse> {
  try {
    const res = await api.post("/employee-salaries", salaryData);

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function getCurrentEmployeeSalary(
  employeeId: string,
): Promise<CurrentEmployeeSalaryResponse> {
  try {
    const res = await api.get(`/employee-salaries/${employeeId}/current`);

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function getEmployeeSalaryHistory(
  employeeId: string,
): Promise<EmployeeSalaryHistoryResponse> {
  try {
    const res = await api.get(`/employee-salaries/${employeeId}/history`);

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}

export async function updateEmployeeSalary(
  salaryId: string,
  salaryData: UpdateEmployeeSalaryPayload,
): Promise<EmployeeSalaryResponse> {
  try {
    const res = await api.patch(`/employee-salaries/${salaryId}`, salaryData);

    return res.data;
  } catch (error) {
    throw toSalaryApiError(error);
  }
}
