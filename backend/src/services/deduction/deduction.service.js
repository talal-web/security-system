import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import Deduction from "../../models/Deduction.js";
import ApiError from "../../utils/ApiError.js";

const hasAreaAccess = (employeeArea, areaScope = {}) => {
  if (!employeeArea) return false;
  if (areaScope.isAdmin) return true;

  const permitted = areaScope.permittedAreaIds || [];
  return permitted.some((id) => String(id) === String(employeeArea));
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateAmount = (amount) => {
  const value = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new ApiError(
      400,
      "Deduction amount must be a valid whole number greater than 0",
    );
  }

  return value;
};

const populateDeduction = (query) =>
  query
    .populate("employee", "empId name fatherName designation status")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

// CREATE
export const createDeductionService = async (data, userId, areaScope = {}) => {
  const { employee, amount, deductionDate, reason } = data;

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const deductionAmount = validateAmount(amount);

  if (typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Deduction reason is required");
  }

  let parsedDeductionDate = new Date();

  if (deductionDate !== undefined) {
    parsedDeductionDate = new Date(deductionDate);

    if (Number.isNaN(parsedDeductionDate.getTime())) {
      throw new ApiError(400, "Invalid deduction date");
    }
  }

  const existingEmployee = await Employee.findById(employee).select(
    "_id empId name fatherName designation status area",
  );

  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!hasAreaAccess(existingEmployee.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  if (existingEmployee.status !== "active") {
    throw new ApiError(
      400,
      "Deduction can only be created for an active employee",
    );
  }

  const deduction = await Deduction.create({
    employee,
    amount: deductionAmount,
    remainingAmount: deductionAmount,
    deductionDate: parsedDeductionDate,
    reason: reason.trim(),
    status: "pending",
    createdBy: userId,
  });

  return populateDeduction(Deduction.findById(deduction._id));
};

// GET ALL
export const getDeductionsService = async (query, areaScope = {}) => {
  const { employee, status, fromDate, toDate, search } = query;
  const filter = {};

  // Area scope
  if (!areaScope.isAdmin) {
    const permittedAreaIds = areaScope.permittedAreaIds || [];

    if (!permittedAreaIds.length) {
      throw new ApiError(403, "Unauthorized area access");
    }

    const employeeIds = await Employee.find({
      area: { $in: permittedAreaIds },
    }).distinct("_id");

    if (!employeeIds.length) {
      throw new ApiError(403, "Unauthorized area access");
    }

    filter.employee = { $in: employeeIds };
  }

  // Requested employee
  if (employee !== undefined) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    if (filter.employee) {
      const allowed = filter.employee.$in.some(
        (id) => String(id) === String(employee),
      );

      if (!allowed) return [];
    }

    filter.employee = employee;
  }

  // Status
  if (status !== undefined) {
    const allowedStatuses = [
      "pending",
      "partially_deducted",
      "fully_deducted",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid deduction status");
    }

    filter.status = status;
  }

  // Date range
  if (fromDate || toDate) {
    filter.deductionDate = {};

    if (fromDate) {
      const startDate = new Date(`${fromDate}T00:00:00`);

      if (Number.isNaN(startDate.getTime())) {
        throw new ApiError(400, "Invalid fromDate");
      }

      filter.deductionDate.$gte = startDate;
    }

    if (toDate) {
      const endDate = new Date(`${toDate}T23:59:59.999`);

      if (Number.isNaN(endDate.getTime())) {
        throw new ApiError(400, "Invalid toDate");
      }

      filter.deductionDate.$lte = endDate;
    }

    if (
      fromDate &&
      toDate &&
      new Date(`${fromDate}T00:00:00`) > new Date(`${toDate}T23:59:59.999`)
    ) {
      throw new ApiError(400, "From date cannot be after to date");
    }
  } else {
    // Default range: from the 10th of this month if today is
    // the 10th or later; otherwise from the 10th of last month.
    const today = new Date();

    const fromMonth =
      today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

    const defaultFromDate = new Date(
      today.getFullYear(),
      fromMonth,
      10,
      0,
      0,
      0,
      0,
    );

    filter.deductionDate = {
      $gte: defaultFromDate,
      $lte: today,
    };
  }

  // Employee search
  if (search?.trim()) {
    const searchTerm = search.trim();

    const employees = await Employee.find({
      $or: [
        { empId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    }).distinct("_id");

    if (!employees.length) return [];

    if (filter.employee) {
      const currentIds = filter.employee.$in
        ? filter.employee.$in
        : [filter.employee];

      const matchingIds = employees.filter((id) =>
        currentIds.some((currentId) => String(currentId) === String(id)),
      );

      if (!matchingIds.length) return [];

      filter.employee = { $in: matchingIds };
    } else {
      filter.employee = { $in: employees };
    }
  }

  return populateDeduction(
    Deduction.find(filter).sort({ deductionDate: -1, createdAt: -1 }).lean(),
  );
};

// EMPLOYEE HISTORY
export const getEmployeeDeductionsService = async (
  employeeId,
  areaScope = {},
) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const employee = await Employee.findById(employeeId).select(
    "_id empId name fatherName designation status area",
  );

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!hasAreaAccess(employee.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  const deductions = await Deduction.find({
    employee: employeeId,
  })
    .sort({ deductionDate: -1, createdAt: -1 })
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return { employee, deductions };
};

// UPDATE
export const updateDeductionService = async (
  id,
  data,
  userId,
  areaScope = {},
) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid deduction ID");
  }

  const deduction = await Deduction.findById(id).populate("employee", "area");

  if (!deduction) {
    throw new ApiError(404, "Deduction not found");
  }

  if (!hasAreaAccess(deduction.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  if (
    deduction.status !== "pending" ||
    deduction.remainingAmount !== deduction.amount
  ) {
    throw new ApiError(
      400,
      "Only deductions that have not been processed can be corrected",
    );
  }

  const { amount, deductionDate, reason } = data;

  if (amount !== undefined) {
    const newAmount = validateAmount(amount);
    deduction.amount = newAmount;
    deduction.remainingAmount = newAmount;
  }

  if (deductionDate !== undefined) {
    const newDate = new Date(deductionDate);

    if (Number.isNaN(newDate.getTime())) {
      throw new ApiError(400, "Invalid deduction date");
    }

    deduction.deductionDate = newDate;
  }

  if (reason !== undefined) {
    if (typeof reason !== "string" || !reason.trim()) {
      throw new ApiError(400, "Deduction reason is required");
    }

    deduction.reason = reason.trim();
  }

  deduction.updatedBy = userId;
  await deduction.save();

  return populateDeduction(Deduction.findById(deduction._id));
};

// CANCEL
export const cancelDeductionService = async (id, userId, areaScope = {}) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid deduction ID");
  }

  const deduction = await Deduction.findById(id).populate("employee", "area");

  if (!deduction) {
    throw new ApiError(404, "Deduction not found");
  }

  if (!hasAreaAccess(deduction.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  if (
    deduction.status !== "pending" ||
    deduction.remainingAmount !== deduction.amount
  ) {
    throw new ApiError(
      400,
      "Only a deduction with no processed amount can be cancelled",
    );
  }

  deduction.status = "cancelled";
  deduction.updatedBy = userId;

  await deduction.save();

  return populateDeduction(Deduction.findById(deduction._id));
};
