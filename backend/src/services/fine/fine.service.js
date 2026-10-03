import mongoose from "mongoose";
import Employee from "../../models/Employee.js";
import Fine from "../../models/Fine.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Get the single area selected and validated by enforceAreaScope.
 */
const getAreaId = (areaScope = {}) => {
  const areaId = areaScope.areaId;

  if (!areaId || !isValidObjectId(areaId)) {
    throw new ApiError(403, "Valid area scope is required");
  }

  return String(areaId);
};

/**
 * Always scope Fine queries to the selected area.
 *
 * IMPORTANT:
 * Admin/developer status does NOT remove the area filter.
 * They can select any area through middleware, but once selected,
 * every operation remains restricted to that area.
 */
const getFineAreaFilter = (areaScope = {}) => {
  const areaId = getAreaId(areaScope);

  return {
    area: new mongoose.Types.ObjectId(areaId),
  };
};

const validateFineAmount = (amount) => {
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
      "Fine amount must be a valid whole number greater than 0",
    );
  }

  return value;
};

const validateFineDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, "Invalid fine date");
  }

  return date;
};

const populateFine = (query) =>
  query
    .populate("employee", "empId name fatherName designation status area")
    .populate("area", "name")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

/**
 * Ensure employee belongs to the currently selected area.
 */
const findEmployeeInArea = async (employeeId, areaScope) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const areaId = getAreaId(areaScope);

  const employee = await Employee.findOne({
    _id: employeeId,
    area: areaId,
  }).select("_id empId name fatherName designation status area");

  if (!employee) {
    throw new ApiError(404, "Employee not found in selected area");
  }

  return employee;
};

// ======================================
// CREATE
// ======================================

export const createFineService = async (data, user, areaScope) => {
  const { employee, amount, fineDate, reason } = data;

  const areaId = getAreaId(areaScope);

  const fineAmount = validateFineAmount(amount);

  if (typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Fine reason is required");
  }

  const parsedDate =
    fineDate === undefined ? new Date() : validateFineDate(fineDate);

  // Employee MUST belong to the selected area.
  const existingEmployee = await findEmployeeInArea(employee, areaScope);

  if (!existingEmployee.area) {
    throw new ApiError(400, "Employee has no assigned area");
  }

  if (String(existingEmployee.area) !== areaId) {
    throw new ApiError(403, "Employee does not belong to the selected area");
  }

  if (existingEmployee.status !== "active") {
    throw new ApiError(400, "Fine can only be created for an active employee");
  }

  const fine = await Fine.create({
    employee: existingEmployee._id,
    area: areaId,
    amount: fineAmount,
    remainingAmount: fineAmount,
    fineDate: parsedDate,
    reason: reason.trim(),
    status: "pending",
    createdBy: user.id,
  });

  return populateFine(Fine.findById(fine._id));
};

// ======================================
// GET ALL
// ======================================

export const getFinesService = async (query = {}, areaScope) => {
  const { employee, status, fromDate, toDate, search } = query;

  // Area ALWAYS comes from middleware.
  const filter = {
    ...getFineAreaFilter(areaScope),
  };

  if (employee !== undefined && employee !== "") {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    filter.employee = employee;
  }

  if (status !== undefined && status !== "") {
    const allowedStatuses = [
      "pending",
      "partially_deducted",
      "fully_deducted",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid fine status");
    }

    filter.status = status;
  }

  // ======================================
  // Date filter
  // ======================================

  if (fromDate || toDate) {
    filter.fineDate = {};

    if (fromDate) {
      const start = new Date(`${fromDate}T00:00:00`);

      if (Number.isNaN(start.getTime())) {
        throw new ApiError(400, "Invalid fromDate");
      }

      filter.fineDate.$gte = start;
    }

    if (toDate) {
      const end = new Date(`${toDate}T23:59:59.999`);

      if (Number.isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid toDate");
      }

      filter.fineDate.$lte = end;
    }

    if (
      filter.fineDate.$gte &&
      filter.fineDate.$lte &&
      filter.fineDate.$gte > filter.fineDate.$lte
    ) {
      throw new ApiError(400, "fromDate cannot be after toDate");
    }
  } else {
    const today = new Date();

    const fromMonth =
      today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

    filter.fineDate = {
      $gte: new Date(today.getFullYear(), fromMonth, 10, 0, 0, 0, 0),
      $lte: today,
    };
  }

  // ======================================
  // Employee search
  // ======================================

  if (search?.trim()) {
    const term = search.trim();

    const employeeFilter = {
      area: getAreaId(areaScope),
      $or: [
        { empId: { $regex: term, $options: "i" } },
        { name: { $regex: term, $options: "i" } },
      ],
    };

    if (employee !== undefined && employee !== "") {
      employeeFilter._id = employee;
    }

    // Search employees ONLY inside selected area.
    const matchingEmployees = await Employee.find(employeeFilter).select("_id");

    const matchingIds = matchingEmployees.map((entry) => entry._id);

    if (!matchingIds.length) {
      return [];
    }

    if (filter.employee) {
      if (!matchingIds.some((id) => String(id) === String(filter.employee))) {
        return [];
      }
    } else {
      filter.employee = { $in: matchingIds };
    }
  }

  return populateFine(
    Fine.find(filter).sort({
      fineDate: -1,
      createdAt: -1,
    }),
  );
};

// ======================================
// EMPLOYEE HISTORY
// ======================================

export const getEmployeeFinesService = async (
  employeeId,
  areaScope,
  query = {},
) => {
  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  // Employee MUST belong to selected area.
  const employee = await findEmployeeInArea(employeeId, areaScope);

  const areaFilter = getFineAreaFilter(areaScope);

  const fines = await Fine.find({
    employee: employeeId,
    ...areaFilter,
  })
    .sort({
      fineDate: -1,
      createdAt: -1,
    })
    .populate("area", "name")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    employee,
    fines,
  };
};

// ======================================
// SHARED LOOKUP
// ======================================

const findFineForAccess = async (id, areaScope) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid fine ID");
  }

  const areaFilter = getFineAreaFilter(areaScope);

  // Fine MUST belong to selected area.
  const fine = await Fine.findOne({
    _id: id,
    ...areaFilter,
  }).populate("employee", "empId name area");

  if (!fine) {
    throw new ApiError(404, "Fine not found in selected area");
  }

  return fine;
};

// ======================================
// UPDATE
// ======================================

export const updateFineService = async (id, data, user, areaScope) => {
  const fine = await findFineForAccess(id, areaScope);

  if (fine.status !== "pending" || fine.remainingAmount !== fine.amount) {
    throw new ApiError(
      400,
      "Only fines that have not been deducted can be corrected",
    );
  }

  const { amount, fineDate, reason } = data;

  if (amount !== undefined) {
    fine.amount = validateFineAmount(amount);
    fine.remainingAmount = fine.amount;
  }

  if (fineDate !== undefined) {
    fine.fineDate = validateFineDate(fineDate);
  }

  if (reason !== undefined) {
    if (typeof reason !== "string" || !reason.trim()) {
      throw new ApiError(400, "Fine reason is required");
    }

    fine.reason = reason.trim();
  }

  // Area is intentionally NOT taken from request data.
  fine.updatedBy = user.id;

  await fine.save();

  return populateFine(Fine.findById(fine._id));
};

// ======================================
// CANCEL
// ======================================

export const cancelFineService = async (id, user, areaScope) => {
  const fine = await findFineForAccess(id, areaScope);

  if (fine.status !== "pending" || fine.remainingAmount !== fine.amount) {
    throw new ApiError(400, "Only a fine with no deductions can be cancelled");
  }

  fine.status = "cancelled";
  fine.updatedBy = user.id;

  await fine.save();

  return populateFine(Fine.findById(fine._id));
};
