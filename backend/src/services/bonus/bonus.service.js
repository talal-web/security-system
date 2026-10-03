import mongoose from "mongoose";

import Employee from "../../models/Employee.js";
import Bonus from "../../models/Bonus.js";
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
    throw new ApiError(400, "Bonus amount must be a positive integer");
  }

  return value;
};

function getDateRange(date, endOfDay = false) {
  const value = new Date(date);

  if (endOfDay) {
    value.setHours(23, 59, 59, 999);
  } else {
    value.setHours(0, 0, 0, 0);
  }

  return value;
}

const populateBonus = (query) =>
  query
    .populate("employee", "empId name fatherName designation status")
    .populate("area", "name")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");

// CREATE BONUS
export async function createBonusService(data, userId, areaScope = {}) {
  const { employeeId, amount, reason, bonusDate, area } = data;

  const scopedAreaId = getScopedAreaId(areaScope);

  if (!isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const bonusAmount = validateAmount(amount);

  if (!reason || typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Bonus reason is required");
  }

  const parsedBonusDate =
    bonusDate === undefined ? new Date() : new Date(bonusDate);

  if (Number.isNaN(parsedBonusDate.getTime())) {
    throw new ApiError(400, "Invalid bonus date");
  }

  // Body area (if sent) must match the selected area.
  if (area !== undefined && normalizeId(area) !== scopedAreaId) {
    throw new ApiError(400, "Conflicting area selections");
  }

  const employee = await Employee.findById(employeeId).select(
    "_id empId name fatherName designation status area",
  );

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!employee.area) {
    throw new ApiError(400, "Employee does not have an assigned area");
  }

  // The employee must belong to the selected area.
  // Returns 404 to avoid revealing employees in other areas.
  if (normalizeId(employee.area) !== scopedAreaId) {
    throw new ApiError(404, "Employee not found in the selected area");
  }

  if (employee.status !== "active") {
    throw new ApiError(400, "Only active employees can receive bonuses");
  }

  const bonus = await Bonus.create({
    employee: employee._id,
    area: employee.area,
    amount: bonusAmount,
    reason: reason.trim(),
    bonusDate: parsedBonusDate,
    status: "pending",
    createdBy: userId,
  });

  return populateBonus(Bonus.findById(bonus._id));
}

// GET BONUSES
export async function getBonusesService(query = {}, areaScope = {}) {
  const { employee, status, search, fromDate, toDate } = query;

  // Always limited to the single selected area.
  const filter = {
    ...getAreaFilter(areaScope),
  };

  if (employee) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
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

  if (
    fromDate &&
    toDate &&
    getDateRange(fromDate) > getDateRange(toDate, true)
  ) {
    throw new ApiError(400, "From date cannot be after to date");
  }

  if (typeof search === "string" && search.trim()) {
    // Escape regex special characters so user input is treated as text.
    const searchTerm = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Search only employees in the selected area.
    const matchingEmployees = await Employee.find({
      area: filter.area,
      $or: [
        { empId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    }).distinct("_id");

    if (!matchingEmployees.length) return [];

    if (filter.employee) {
      const matches = matchingEmployees.some(
        (id) => normalizeId(id) === normalizeId(filter.employee),
      );

      if (!matches) return [];
    } else {
      filter.employee = { $in: matchingEmployees };
    }
  }

  return populateBonus(
    Bonus.find(filter).sort({ bonusDate: -1, createdAt: -1 }),
  );
}

// GET ONE EMPLOYEE'S BONUSES
export async function getEmployeeBonusesService(employeeId, areaScope = {}) {
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

  // Bonus records are filtered by their stored area.
  const bonuses = await populateBonus(
    Bonus.find({
      employee: employeeId,
      area: scopedAreaId,
    }).sort({ bonusDate: -1, createdAt: -1 }),
  );

  // Don't reveal an employee from another area unless they have
  // bonus history stored under the selected area (e.g. they moved).
  if (normalizeId(employee.area) !== scopedAreaId && !bonuses.length) {
    throw new ApiError(404, "Employee not found in the selected area");
  }

  return { employee, bonuses };
}

// Find a bonus using its stored area.
const findBonusForAccess = async (bonusId, areaScope = {}) => {
  const bonus = await Bonus.findOne({
    _id: bonusId,
    ...getAreaFilter(areaScope),
  });

  if (!bonus) {
    throw new ApiError(404, "Bonus not found");
  }

  return bonus;
};

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

  const bonus = await findBonusForAccess(bonusId, areaScope);

  if (bonus.status !== "pending") {
    throw new ApiError(400, "Only pending bonuses can be updated");
  }

  if (data.amount !== undefined) {
    bonus.amount = validateAmount(data.amount);
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

  return populateBonus(Bonus.findById(bonus._id));
}

// CANCEL BONUS
export async function cancelBonusService(bonusId, userId, areaScope = {}) {
  if (!isValidObjectId(bonusId)) {
    throw new ApiError(400, "Invalid bonus ID");
  }

  const bonus = await findBonusForAccess(bonusId, areaScope);

  if (bonus.status !== "pending") {
    throw new ApiError(400, "Only pending bonuses can be cancelled");
  }

  bonus.status = "cancelled";
  bonus.updatedBy = userId;

  await bonus.save();

  return populateBonus(Bonus.findById(bonus._id));
}
