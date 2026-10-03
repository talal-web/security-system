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

// ======================================
// Area scope helpers
// ======================================

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth for every query below.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!isValidObjectId(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

// Salary records have no area of their own, so access follows the
// employee's current area. Returns 404 to avoid revealing employees
// in other areas.
const findEmployeeInScope = async (employeeId, areaScope, select) => {
  const employee = await Employee.findOne({
    _id: employeeId,
    area: getScopedAreaId(areaScope),
  }).select(select);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};

const validateSalary = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
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
export const createEmployeeSalaryService = async (
  data,
  userId,
  areaScope = {},
) => {
  const { employee, monthlySalary, effectiveFrom, reason, notes, area } = data;

  const scopedAreaId = getScopedAreaId(areaScope);

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  // Body area (if sent) must match the selected area.
  if (area !== undefined && String(area) !== scopedAreaId) {
    throw new ApiError(400, "Conflicting area selections");
  }

  const salaryAmount = validateSalary(monthlySalary);
  const salaryEffectiveDate = validateEffectiveDate(effectiveFrom, true);

  if (reason && !allowedReasons.includes(reason)) {
    throw new ApiError(400, "Invalid salary change reason");
  }

  const existingEmployee = await findEmployeeInScope(
    employee,
    areaScope,
    "_id",
  );

  const existingSalary = await EmployeeSalary.findOne({
    employee: existingEmployee._id,
    effectiveFrom: salaryEffectiveDate,
  });

  if (existingSalary) {
    throw new ApiError(
      409,
      "A salary record already exists for this effective month",
    );
  }

  const salaryCount = await EmployeeSalary.countDocuments({
    employee: existingEmployee._id,
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

  const salary = await EmployeeSalary.create({
    employee: existingEmployee._id,
    monthlySalary: salaryAmount,
    effectiveFrom: salaryEffectiveDate,
    reason: reason || (salaryCount === 0 ? "initial_salary" : "other"),
    notes: typeof notes === "string" ? notes.trim() || undefined : undefined,
    createdBy: userId,
  });

  return populateSalary(EmployeeSalary.findById(salary._id));
};

// CURRENT SALARY
export const getCurrentEmployeeSalaryService = async (
  employeeId,
  areaScope = {},
) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await findEmployeeInScope(
    employeeId,
    areaScope,
    "_id empId name fatherName designation status",
  );

  const currentDate = new Date();

  const salary = await getSalaryForPayrollMonth(
    employee._id,
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
export const getEmployeeSalaryHistoryService = async (
  employeeId,
  areaScope = {},
) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await findEmployeeInScope(
    employeeId,
    areaScope,
    "_id empId name fatherName designation status",
  );

  const salaryHistory = await EmployeeSalary.find({
    employee: employee._id,
  })
    .sort({ effectiveFrom: -1 })
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return { employee, salaryHistory };
};

// UPDATE
export const updateEmployeeSalaryService = async (
  id,
  data,
  userId,
  areaScope = {},
) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid salary record ID");
  }

  const scopedAreaId = getScopedAreaId(areaScope);

  const salary = await EmployeeSalary.findById(id);

  if (!salary) {
    throw new ApiError(404, "Salary record not found");
  }

  // The salary's employee must currently belong to the selected area.
  const employeeInScope = await Employee.exists({
    _id: salary.employee,
    area: scopedAreaId,
  });

  if (!employeeInScope) {
    throw new ApiError(404, "Salary record not found");
  }

  const { monthlySalary, effectiveFrom, reason, notes } = data;

  if (monthlySalary !== undefined) {
    salary.monthlySalary = validateSalary(monthlySalary);
  }

  if (effectiveFrom !== undefined) {
    const newDate = validateEffectiveDate(effectiveFrom);

    const duplicate = await EmployeeSalary.exists({
      employee: salary.employee,
      effectiveFrom: newDate,
      _id: { $ne: salary._id },
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "A salary record already exists for this effective month",
      );
    }

    salary.effectiveFrom = newDate;
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
// Internal helper: not area-scoped. Callers must already have verified
// the employee's area access.
export const getSalaryForPayrollMonth = async (employeeId, year, month) => {
  const nextMonthStart = new Date(Date.UTC(year, month, 1));

  return EmployeeSalary.findOne({
    employee: employeeId,
    effectiveFrom: { $lt: nextMonthStart },
  }).sort({ effectiveFrom: -1 });
};
