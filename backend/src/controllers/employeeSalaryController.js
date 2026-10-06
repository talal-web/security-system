import ApiError from "../utils/ApiError.js";
import {
  createEmployeeSalaryService,
  getCurrentEmployeeSalaryService,
  getEmployeeSalaryHistoryService,
  updateEmployeeSalaryService,
} from "../services/employee-salary/employeeSalary.service.js";

// CREATE
export const createEmployeeSalary = async (req, res) => {
  try {
    const salary = await createEmployeeSalaryService(
      req.body,
      req.user.id,
      req.areaScope,
    );

    return res.status(201).json({
      success: true,
      message: "Employee salary created successfully",
      data: salary,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A salary record already exists for this employee and month",
      );
    }

    throw error;
  }
};

// CURRENT SALARY
export const getCurrentEmployeeSalary = async (req, res) => {
  const result = await getCurrentEmployeeSalaryService(
    req.params.employeeId,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    data: {
      employee: result.employee,
      salary: result.salary,
    },
  });
};

// SALARY HISTORY
export const getEmployeeSalaryHistory = async (req, res) => {
  const result = await getEmployeeSalaryHistoryService(
    req.params.employeeId,
    req.areaScope,
  );

  return res.status(200).json({
    success: true,
    count: result.salaryHistory.length,
    data: {
      employee: result.employee,
      salaryHistory: result.salaryHistory,
    },
  });
};

// UPDATE
export const updateEmployeeSalary = async (req, res) => {
  try {
    const salary = await updateEmployeeSalaryService(
      req.params.id,
      req.body,
      req.user.id,
      req.areaScope,
    );

    return res.status(200).json({
      success: true,
      message: "Employee salary updated successfully",
      data: salary,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A salary record already exists for this employee and month",
      );
    }

    throw error;
  }
};
