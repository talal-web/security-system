import mongoose from "mongoose";
import Employee from "../../models/Employee.js";
import EmployeeSalary from "../../models/EmployeeSalary.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const allowedReasons = [
  "initial_salary",
  "salary_increase",
  "salary_decrease",
  "promotion",
  "designation_change",
  "other",
];

const validateSalary = (value) => {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(Number(value)) ||
    Number(value) < 0
  ) {
    throw new ApiError(
      400,
      "Monthly salary must be a valid non-negative number",
    );
  }

  return Number(value);
};

const validateEffectiveDate = (value, required = false) => {
  if (required && !value) {
    throw new ApiError(400, "Valid effective date is required");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(
      400,
      required ? "Valid effective date is required" : "Invalid effective date",
    );
  }

  if (date.getUTCDate() !== 1) {
    throw new ApiError(
      400,
      "Salary effective date must be the first day of a month",
    );
  }

  return date;
};

const populateSalary = (query) =>
  query
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

// CREATE
export const createEmployeeSalaryService = async (data, userId) => {
  const { employee, monthlySalary, effectiveFrom, reason, notes } = data;

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const salaryAmount = validateSalary(monthlySalary);
  const salaryEffectiveDate = validateEffectiveDate(effectiveFrom, true);

  const existingEmployee = await Employee.findById(employee);

  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  const existingSalary = await EmployeeSalary.findOne({
    employee,
    effectiveFrom: salaryEffectiveDate,
  });

  if (existingSalary) {
    throw new ApiError(
      409,
      "A salary record already exists for this effective month",
    );
  }

  const salaryCount = await EmployeeSalary.countDocuments({
    employee,
  });

  if (salaryCount === 0 && reason && reason !== "initial_salary") {
    throw new ApiError(
      400,
      "The first salary record must use initial_salary reason",
    );
  }

  if (salaryCount > 0 && reason === "initial_salary") {
    throw new ApiError(
      400,
      "initial_salary can only be used for the employee's first salary record",
    );
  }

  if (reason && !allowedReasons.includes(reason)) {
    throw new ApiError(400, "Invalid salary change reason");
  }

  const salary = await EmployeeSalary.create({
    employee,
    monthlySalary: salaryAmount,
    effectiveFrom: salaryEffectiveDate,
    reason: reason || (salaryCount === 0 ? "initial_salary" : "other"),
    notes: notes?.trim() || undefined,
    createdBy: userId,
  });

  return EmployeeSalary.findById(salary._id)
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name userId");
};

// CURRENT SALARY
export const getCurrentEmployeeSalaryService = async (employeeId) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await Employee.findById(employeeId).select(
    "_id empId name fatherName designation status",
  );

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const currentDate = new Date();

  const salary = await getSalaryForPayrollMonth(
    employeeId,
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth() + 1,
  );

  if (!salary) {
    throw new ApiError(404, "No salary record found for this employee");
  }

  const populatedSalary = await EmployeeSalary.findById(salary._id)
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return { employee, salary: populatedSalary };
};

// SALARY HISTORY
export const getEmployeeSalaryHistoryService = async (employeeId) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await Employee.findById(employeeId).select(
    "_id empId name fatherName designation status",
  );

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const salaryHistory = await EmployeeSalary.find({
    employee: employeeId,
  })
    .sort({ effectiveFrom: -1 })
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return { employee, salaryHistory };
};

// UPDATE
export const updateEmployeeSalaryService = async (id, data, userId) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid salary record ID");
  }

  const salary = await EmployeeSalary.findById(id);

  if (!salary) {
    throw new ApiError(404, "Salary record not found");
  }

  const { monthlySalary, effectiveFrom, reason, notes } = data;

  if (monthlySalary !== undefined) {
    salary.monthlySalary = validateSalary(monthlySalary);
  }

  if (effectiveFrom !== undefined) {
    salary.effectiveFrom = validateEffectiveDate(effectiveFrom);
  }

  if (reason !== undefined) {
    if (!allowedReasons.includes(reason)) {
      throw new ApiError(400, "Invalid salary change reason");
    }

    salary.reason = reason;
  }

  if (notes !== undefined) {
    if (typeof notes !== "string" && notes !== null) {
      throw new ApiError(400, "Invalid notes");
    }

    salary.notes = notes?.trim() || undefined;
  }

  salary.updatedBy = userId;
  await salary.save();

  return populateSalary(EmployeeSalary.findById(salary._id));
};

// HELPER USED BY PAYROLL
export const getSalaryForPayrollMonth = async (employeeId, year, month) => {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const nextMonthStart = new Date(Date.UTC(year, month, 1));

  return EmployeeSalary.findOne({
    employee: employeeId,
    effectiveFrom: { $lt: nextMonthStart },
  }).sort({ effectiveFrom: -1 });
};
