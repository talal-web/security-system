import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import Deduction from "../../models/Deduction.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeId = (id) => (id ? String(id) : null);

// ======================================
// Area scope helpers
// ======================================

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth for every query below.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!isValidObjectId(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

const getAreaFilter = (areaScope = {}) => ({
  area: getScopedAreaId(areaScope),
});

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
    .populate("area", "name")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

// CREATE
export const createDeductionService = async (data, userId, areaScope = {}) => {
  const { employee, amount, deductionDate, reason, area } = data;

  const scopedAreaId = getScopedAreaId(areaScope);

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const deductionAmount = validateAmount(amount);

  if (typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Deduction reason is required");
  }

  const parsedDeductionDate =
    deductionDate === undefined ? new Date() : new Date(deductionDate);

  if (Number.isNaN(parsedDeductionDate.getTime())) {
    throw new ApiError(400, "Invalid deduction date");
  }

  // Body area (if sent) must match the selected area.
  if (area !== undefined && normalizeId(area) !== scopedAreaId) {
    throw new ApiError(400, "Conflicting area selections");
  }

  const existingEmployee = await Employee.findById(employee).select(
    "_id empId name fatherName designation status area",
  );

  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!existingEmployee.area) {
    throw new ApiError(400, "Employee does not have an assigned area");
  }

  // The employee must belong to the selected area.
  // Returns 404 to avoid revealing employees in other areas.
  if (normalizeId(existingEmployee.area) !== scopedAreaId) {
    throw new ApiError(404, "Employee not found in the selected area");
  }

  if (existingEmployee.status !== "active") {
    throw new ApiError(
      400,
      "Deduction can only be created for an active employee",
    );
  }

  const deduction = await Deduction.create({
    employee: existingEmployee._id,
    area: existingEmployee.area,
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
export const getDeductionsService = async (query = {}, areaScope = {}) => {
  const { employee, status, fromDate, toDate, search } = query;

  // Always limited to the single selected area.
  const filter = {
    ...getAreaFilter(areaScope),
  };

  // Requested employee
  if (employee !== undefined) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
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
      filter.deductionDate.$gte &&
      filter.deductionDate.$lte &&
      filter.deductionDate.$gte > filter.deductionDate.$lte
    ) {
      throw new ApiError(400, "From date cannot be after to date");
    }
  } else {
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
  if (typeof search === "string" && search.trim()) {
    // Escape regex special characters so user input is treated as text.
    const searchTerm = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Search only employees in the selected area.
    const employees = await Employee.find({
      area: filter.area,
      $or: [
        { empId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    }).distinct("_id");

    if (!employees.length) return [];

    if (filter.employee) {
      const matches = employees.some(
        (id) => normalizeId(id) === normalizeId(filter.employee),
      );

      if (!matches) return [];
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

  const scopedAreaId = getScopedAreaId(areaScope);

  const employee = await Employee.findById(employeeId).select(
    "_id empId name fatherName designation status area",
  );

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  // Deduction records are filtered by their stored area.
  const deductions = await Deduction.find({
    employee: employeeId,
    area: scopedAreaId,
  })
    .sort({ deductionDate: -1, createdAt: -1 })
    .populate("area", "name")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  // Don't reveal an employee from another area unless they have
  // deduction history stored under the selected area (e.g. they moved).
  if (normalizeId(employee.area) !== scopedAreaId && !deductions.length) {
    throw new ApiError(404, "Employee not found in the selected area");
  }

  return { employee, deductions };
};

// Find a deduction using its stored area, not the employee's current area.
const findDeductionForAccess = async (id, areaScope = {}) => {
  const deduction = await Deduction.findOne({
    _id: id,
    ...getAreaFilter(areaScope),
  });

  if (!deduction) {
    throw new ApiError(404, "Deduction not found");
  }

  return deduction;
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

  const deduction = await findDeductionForAccess(id, areaScope);

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

  const deduction = await findDeductionForAccess(id, areaScope);

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
