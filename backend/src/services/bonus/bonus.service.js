import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import Bonus from "../../models/Bonus.js";
import ApiError from "../../utils/ApiError.js";

function hasAreaAccess(employeeArea, areaScope = {}) {
  if (!employeeArea) return false;

  if (areaScope.isAdmin) return true;

  return (areaScope.permittedAreaIds || []).some(
    (id) => String(id) === String(employeeArea),
  );
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function getDateRange(date, endOfDay = false) {
  const value = new Date(date);

  if (endOfDay) {
    value.setHours(23, 59, 59, 999);
  } else {
    value.setHours(0, 0, 0, 0);
  }

  return value;
}

// CREATE BONUS
export async function createBonusService(data, userId, areaScope = {}) {
  const { employeeId, amount, reason, bonusDate } = data;

  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0) {
    throw new ApiError(400, "Bonus amount must be a positive integer");
  }

  if (!reason || typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Bonus reason is required");
  }

  let parsedBonusDate = new Date();

  if (bonusDate !== undefined) {
    parsedBonusDate = new Date(bonusDate);

    if (Number.isNaN(parsedBonusDate.getTime())) {
      throw new ApiError(400, "Invalid bonus date");
    }
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

  if (employee.status !== "active") {
    throw new ApiError(400, "Only active employees can receive bonuses");
  }

  const bonus = await Bonus.create({
    employee: employee._id,
    amount,
    reason: reason.trim(),
    bonusDate: parsedBonusDate,
    status: "pending",
    createdBy: userId,
  });

  return Bonus.findById(bonus._id)
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
}

// GET BONUSES
export async function getBonusesService(query, areaScope = {}) {
  const { employee, status, search, fromDate, toDate } = query;

  const filter = {};

  // Apply area restriction first.
  if (!areaScope.isAdmin) {
    const permittedAreaIds = areaScope.permittedAreaIds || [];

    if (permittedAreaIds.length === 0) {
      throw new ApiError(403, "Unauthorized area access");
    }

    const employeesInAreas = await Employee.find({
      area: { $in: permittedAreaIds },
    }).distinct("_id");

    if (employeesInAreas.length === 0) {
      throw new ApiError(403, "Unauthorized area access");
    }

    filter.employee = { $in: employeesInAreas };
  }

  // Intersect a requested employee with the area restriction.
  if (employee) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    if (filter.employee) {
      const allowedIds = filter.employee.$in;
      const isAllowed = allowedIds.some(
        (id) => String(id) === String(employee),
      );

      if (!isAllowed) {
        return [];
      }
    }

    filter.employee = employee;
  }

  if (status) {
    const allowedStatuses = ["pending", "paid", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid bonus status");
    }

    filter.status = status;
  }

  if (fromDate) {
    const parsedFromDate = new Date(fromDate);

    if (Number.isNaN(parsedFromDate.getTime())) {
      throw new ApiError(400, "Invalid from date");
    }

    filter.bonusDate = {
      ...filter.bonusDate,
      $gte: getDateRange(parsedFromDate),
    };
  }

  if (toDate) {
    const parsedToDate = new Date(toDate);

    if (Number.isNaN(parsedToDate.getTime())) {
      throw new ApiError(400, "Invalid to date");
    }

    filter.bonusDate = {
      ...filter.bonusDate,
      $lte: getDateRange(parsedToDate, true),
    };
  }

  if (fromDate && toDate) {
    if (new Date(fromDate) > new Date(toDate)) {
      throw new ApiError(400, "From date cannot be after to date");
    }
  }

  // Search employees by employee ID or name.
  if (search && search.trim()) {
    const matchingEmployees = await Employee.find({
      $or: [
        { empId: { $regex: search.trim(), $options: "i" } },
        { name: { $regex: search.trim(), $options: "i" } },
      ],
    }).distinct("_id");

    if (filter.employee) {
      const currentIds = filter.employee.$in
        ? filter.employee.$in
        : [filter.employee];

      const matchingIds = matchingEmployees.filter((id) =>
        currentIds.some((currentId) => String(currentId) === String(id)),
      );

      filter.employee = { $in: matchingIds };
    } else {
      filter.employee = { $in: matchingEmployees };
    }
  }

  return Bonus.find(filter)
    .sort({ bonusDate: -1, createdAt: -1 })
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
}

// GET ONE EMPLOYEE'S BONUSES
export async function getEmployeeBonusesService(employeeId, areaScope = {}) {
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

  const bonuses = await Bonus.find({ employee: employeeId })
    .sort({ bonusDate: -1, createdAt: -1 })
    .populate("createdBy", "name")
    .populate("updatedBy", "name");

  return { employee, bonuses };
}

// UPDATE BONUS
export async function updateBonusService(
  bonusId,
  data,
  userId,
  areaScope = {},
) {
  if (!isValidObjectId(bonusId)) {
    throw new ApiError(400, "Invalid bonus ID");
  }

  const bonus = await Bonus.findById(bonusId).populate("employee", "area");

  if (!bonus) {
    throw new ApiError(404, "Bonus not found");
  }

  if (!hasAreaAccess(bonus.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  if (bonus.status !== "pending") {
    throw new ApiError(400, "Only pending bonuses can be updated");
  }

  if (data.amount !== undefined) {
    if (
      !Number.isFinite(data.amount) ||
      !Number.isInteger(data.amount) ||
      data.amount <= 0
    ) {
      throw new ApiError(400, "Bonus amount must be a positive integer");
    }

    bonus.amount = data.amount;
  }

  if (data.reason !== undefined) {
    if (typeof data.reason !== "string" || !data.reason.trim()) {
      throw new ApiError(400, "Bonus reason is required");
    }

    bonus.reason = data.reason.trim();
  }

  if (data.bonusDate !== undefined) {
    const parsedDate = new Date(data.bonusDate);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid bonus date");
    }

    bonus.bonusDate = parsedDate;
  }

  bonus.updatedBy = userId;
  await bonus.save();

  return Bonus.findById(bonus._id)
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
}

// CANCEL BONUS
export async function cancelBonusService(bonusId, userId, areaScope = {}) {
  if (!isValidObjectId(bonusId)) {
    throw new ApiError(400, "Invalid bonus ID");
  }

  const bonus = await Bonus.findById(bonusId).populate("employee", "area");

  if (!bonus) {
    throw new ApiError(404, "Bonus not found");
  }

  if (!hasAreaAccess(bonus.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  if (bonus.status !== "pending") {
    throw new ApiError(400, "Only pending bonuses can be cancelled");
  }

  bonus.status = "cancelled";
  bonus.updatedBy = userId;

  await bonus.save();

  return Bonus.findById(bonus._id)
    .populate("employee", "empId name fatherName designation")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
}
