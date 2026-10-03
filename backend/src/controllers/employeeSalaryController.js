import {
  createEmployeeSalaryService,
  getCurrentEmployeeSalaryService,
  getEmployeeSalaryHistoryService,
  updateEmployeeSalaryService,
} from "../services/employee-salary/employeeSalary.service.js";

// CREATE
export const createEmployeeSalary = async (req, res, next) => {
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
      return res.status(409).json({
        success: false,
        message: "A salary record already exists for this employee and month",
      });
    }

    console.error("createEmployeeSalary error:", error);
    error.operationMessage = "Failed to create employee salary";
    next(error);
  }
};

// CURRENT SALARY
export const getCurrentEmployeeSalary = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error("getCurrentEmployeeSalary error:", error);
    error.operationMessage = "Failed to get current employee salary";
    next(error);
  }
};

// SALARY HISTORY
export const getEmployeeSalaryHistory = async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error("getEmployeeSalaryHistory error:", error);
    error.operationMessage = "Failed to get employee salary history";
    next(error);
  }
};

// UPDATE
export const updateEmployeeSalary = async (req, res, next) => {
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
      return res.status(409).json({
        success: false,
        message: "A salary record already exists for this employee and month",
      });
    }

    console.error("updateEmployeeSalary error:", error);
    error.operationMessage = "Failed to update employee salary";
    next(error);
  }
};
