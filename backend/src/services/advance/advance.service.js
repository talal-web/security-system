import mongoose from "mongoose";
import Employee from "../../models/Employee.js";
import Advance from "../../models/Advance.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const hasAreaAccess = (employeeArea, areaScope = {}) => {
  if (!employeeArea) {
    return false;
  }

  if (areaScope.isAdmin) {
    return true;
  }

  const permitted = areaScope.permittedAreaIds || [];
  return permitted.includes(String(employeeArea));
};

// ======================================
// Create Advance
// ======================================

export const createAdvanceService = async (body, user, areaScope) => {
  const { employee, amount, advanceDate, description } = body;

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

  if (!hasAreaAccess(existingEmployee.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  const advance = await Advance.create({
    employee: employee,
    amount: advanceAmount,
    remainingAmount: advanceAmount,
    advanceDate: parsedAdvanceDate,
    description: description?.trim() || "",
    status: "active",
    createdBy: user.id,
  });

  const populatedAdvance = await Advance.findById(advance._id)
    .populate("employee", "empId name fatherName designation status")
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

export const getAdvancesService = async (query, areaScope = {}) => {
  const { employee, status, fromDate, toDate, search } = query;
  const filter = {};

  if (!areaScope.isAdmin) {
    const permittedAreaIds = areaScope.permittedAreaIds || [];

    if (!permittedAreaIds.length) {
      throw new ApiError(403, "Unauthorized area access");
    }

    const employeeAreaQuery = await Employee.find({
      area: { $in: permittedAreaIds },
    }).select("_id");

    const employeeIdsInScope = employeeAreaQuery.map((entry) => entry._id);

    filter.employee = { $in: employeeIdsInScope };
  }

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

  if (search?.trim()) {
    const searchTerm = search.trim();

    const employees = await Employee.find({
      $or: [
        { empId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("_id");

    const employeeIds = employees.map((employee) => employee._id);

    filter.employee = {
      $in: employeeIds,
    };
  }

  const advances = await Advance.find(filter)
    .sort({ advanceDate: -1, createdAt: -1 })
    .populate("employee", "empId name fatherName designation status")
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

export const getEmployeeAdvancesService = async (employeeId, areaScope) => {
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

  const advances = await Advance.find({
    employee: employeeId,
  })
    .sort({ advanceDate: -1, createdAt: -1 })
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

export const updateAdvanceService = async (id, body, user, areaScope) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid advance ID");
  }

  const advance = await Advance.findById(id).populate("employee", "area");

  if (!advance) {
    throw new ApiError(404, "Advance not found");
  }

  if (!hasAreaAccess(advance.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
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
    advance.description = description.trim();
  }

  advance.updatedBy = user.id;

  await advance.save();

  const updatedAdvance = await Advance.findById(advance._id)
    .populate("employee", "empId name fatherName designation status")
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

export const cancelAdvanceService = async (id, user, areaScope) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid advance ID");
  }

  const advance = await Advance.findById(id).populate("employee", "area");

  if (!advance) {
    throw new ApiError(404, "Advance not found");
  }

  if (!hasAreaAccess(advance.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
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
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return {
    success: true,
    message: "Advance cancelled successfully",
    data: cancelledAdvance,
  };
};
