import mongoose from "mongoose";
import Employee from "../../models/Employee.js";
import Advance from "../../models/Advance.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ======================================
// Area scope helpers
// ======================================

// The middleware (enforceAreaScope) has already validated exactly one area.
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

// ======================================
// Create Advance
// ======================================

export const createAdvanceService = async (body, user, areaScope = {}) => {
  const { employee, amount, advanceDate, description, area } = body;

  const scopedAreaId = getScopedAreaId(areaScope);

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const advanceAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    !Number.isFinite(advanceAmount) ||
    advanceAmount <= 0
  ) {
    throw new ApiError(400, "Advance amount must be greater than 0");
  }

  let parsedAdvanceDate = new Date();

  if (advanceDate !== undefined) {
    parsedAdvanceDate = new Date(advanceDate);

    if (Number.isNaN(parsedAdvanceDate.getTime())) {
      throw new ApiError(400, "Invalid advance date");
    }
  }

  const existingEmployee = await Employee.findById(employee).select(
    "_id empId name fatherName designation status area",
  );

  if (!existingEmployee) {
    throw new ApiError(404, "Employee not found");
  }

  if (!existingEmployee.area) {
    throw new ApiError(400, "Employee has no assigned area");
  }

  // Body area (if sent) is the selected area; it must match the scope.
  if (area !== undefined && String(area) !== scopedAreaId) {
    throw new ApiError(400, "Conflicting area selections");
  }

  // The employee must belong to the selected area.
  // Returns 404 to avoid revealing employees in other areas.
  if (String(existingEmployee.area) !== scopedAreaId) {
    throw new ApiError(404, "Employee not found in the selected area");
  }

  const advance = await Advance.create({
    employee: existingEmployee._id,
    area: existingEmployee.area,
    amount: advanceAmount,
    remainingAmount: advanceAmount,
    advanceDate: parsedAdvanceDate,
    description: description?.trim() || "",
    status: "active",
    createdBy: user.id,
  });

  const populatedAdvance = await Advance.findById(advance._id)
    .populate("employee", "empId name fatherName designation status")
    .populate("area")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    message: "Advance created successfully",
    data: populatedAdvance,
  };
};

// ======================================
// Get All Advances
// ======================================

export const getAdvancesService = async (query = {}, areaScope = {}) => {
  const { employee, status, fromDate, toDate, search } = query;

  // Always limited to the single selected area.
  const filter = {
    ...getAreaFilter(areaScope),
  };

  if (employee !== undefined) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    filter.employee = employee;
  }

  if (status !== undefined) {
    const allowedStatuses = [
      "active",
      "partially_deducted",
      "fully_deducted",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid advance status");
    }

    filter.status = status;
  }

  if (fromDate || toDate) {
    filter.advanceDate = {};

    if (fromDate) {
      const startDate = new Date(`${fromDate}T00:00:00`);

      if (Number.isNaN(startDate.getTime())) {
        throw new ApiError(400, "Invalid fromDate");
      }

      filter.advanceDate.$gte = startDate;
    }

    if (toDate) {
      const endDate = new Date(`${toDate}T23:59:59.999`);

      if (Number.isNaN(endDate.getTime())) {
        throw new ApiError(400, "Invalid toDate");
      }

      filter.advanceDate.$lte = endDate;
    }

    if (
      filter.advanceDate.$gte &&
      filter.advanceDate.$lte &&
      filter.advanceDate.$gte > filter.advanceDate.$lte
    ) {
      throw new ApiError(400, "fromDate cannot be after toDate");
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

    filter.advanceDate = {
      $gte: defaultFromDate,
      $lte: today,
    };
  }

  if (typeof search === "string" && search.trim()) {
    const searchTerm = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Search only employees in the selected area.
    const employees = await Employee.find({
      area: filter.area,
      $or: [
        { empId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("_id");

    const employeeIds = employees.map((entry) => entry._id);

    if (filter.employee) {
      // Both conditions must hold: the requested employee AND a search match.
      filter.employee = {
        $in: employeeIds,
        $eq: filter.employee,
      };
    } else {
      filter.employee = { $in: employeeIds };
    }
  }

  const advances = await Advance.find(filter)
    .sort({ advanceDate: -1, createdAt: -1 })
    .populate("employee", "empId name fatherName designation status")
    .populate("area")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    count: advances.length,
    data: advances,
  };
};

// ======================================
// Get Employee Advance History
// ======================================

export const getEmployeeAdvancesService = async (
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

  // History authorization is based on each advance's stored area,
  // not the employee's current area. Only advances stored under the
  // selected area are returned.
  const filter = {
    employee: employeeId,
    ...getAreaFilter(areaScope),
  };

  const advances = await Advance.find(filter)
    .sort({ advanceDate: -1, createdAt: -1 })
    .populate("area")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    count: advances.length,
    data: {
      employee,
      advances,
    },
  };
};

// ======================================
// Update Advance
// ======================================

export const updateAdvanceService = async (id, body, user, areaScope = {}) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid advance ID");
  }

  const advance = await Advance.findOne({
    _id: id,
    ...getAreaFilter(areaScope),
  });

  if (!advance) {
    throw new ApiError(404, "Advance not found");
  }

  if (
    advance.status !== "active" ||
    advance.remainingAmount !== advance.amount
  ) {
    throw new ApiError(
      400,
      "Only advances that have not been deducted can be corrected",
    );
  }

  const { amount, advanceDate, description } = body;

  if (amount !== undefined) {
    const newAmount = Number(amount);

    if (!Number.isFinite(newAmount) || newAmount <= 0) {
      throw new ApiError(400, "Advance amount must be greater than 0");
    }

    advance.amount = newAmount;
    advance.remainingAmount = newAmount;
  }

  if (advanceDate !== undefined) {
    const newDate = new Date(advanceDate);

    if (Number.isNaN(newDate.getTime())) {
      throw new ApiError(400, "Invalid advance date");
    }

    advance.advanceDate = newDate;
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new ApiError(400, "Description must be a string");
    }

    advance.description = description.trim();
  }

  advance.updatedBy = user.id;

  await advance.save();

  const updatedAdvance = await Advance.findById(advance._id)
    .populate("employee", "empId name fatherName designation status")
    .populate("area")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    message: "Advance updated successfully",
    data: updatedAdvance,
  };
};

// ======================================
// Cancel Advance
// ======================================

export const cancelAdvanceService = async (id, user, areaScope = {}) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid advance ID");
  }

  const advance = await Advance.findOne({
    _id: id,
    ...getAreaFilter(areaScope),
  });

  if (!advance) {
    throw new ApiError(404, "Advance not found");
  }

  if (
    advance.status !== "active" ||
    advance.remainingAmount !== advance.amount
  ) {
    throw new ApiError(
      400,
      "Only an advance with no deductions can be cancelled",
    );
  }

  advance.status = "cancelled";
  advance.updatedBy = user.id;

  await advance.save();

  const cancelledAdvance = await Advance.findById(advance._id)
    .populate("employee", "empId name fatherName designation status")
    .populate("area")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    message: "Advance cancelled successfully",
    data: cancelledAdvance,
  };
};
