import mongoose from "mongoose";
import Employee from "../../models/Employee.js";
import Fine from "../../models/Fine.js";
import ApiError from "../../utils/ApiError.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const hasAreaAccess = (employeeArea, areaScope = {}) => {
  if (!employeeArea) return false;
  if (areaScope.isAdmin) return true;

  return (areaScope.permittedAreaIds || []).some(
    (id) => String(id) === String(employeeArea),
  );
};

const getScopedEmployeeIds = async (areaScope = {}) => {
  if (areaScope.isAdmin) return null;

  const permitted = areaScope.permittedAreaIds || [];

  if (!permitted.length) {
    throw new ApiError(403, "Unauthorized area access");
  }

  const employees = await Employee.find({
    area: { $in: permitted },
  }).select("_id");

  return employees.map((employee) => employee._id);
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
    .populate("employee", "empId name fatherName designation status")
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

// CREATE
export const createFineService = async (data, user, areaScope) => {
  const { employee, amount, fineDate, reason } = data;

  if (!employee || !isValidObjectId(employee)) {
    throw new ApiError(400, "Valid employee ID is required");
  }

  const fineAmount = validateFineAmount(amount);

  if (typeof reason !== "string" || !reason.trim()) {
    throw new ApiError(400, "Fine reason is required");
  }

  const parsedDate =
    fineDate === undefined ? new Date() : validateFineDate(fineDate);

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
    throw new ApiError(400, "Fine can only be created for an active employee");
  }

  const fine = await Fine.create({
    employee,
    amount: fineAmount,
    remainingAmount: fineAmount,
    fineDate: parsedDate,
    reason: reason.trim(),
    status: "pending",
    createdBy: user.id,
  });

  return populateFine(Fine.findById(fine._id));
};

// GET ALL
export const getFinesService = async (query, areaScope) => {
  const { employee, status, fromDate, toDate, search } = query;
  const filter = {};

  const scopedIds = await getScopedEmployeeIds(areaScope);

  if (scopedIds !== null) {
    filter.employee = { $in: scopedIds };
  }

  if (employee !== undefined) {
    if (!isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    const requestedId = String(employee);

    if (
      scopedIds !== null &&
      !scopedIds.some((id) => String(id) === requestedId)
    ) {
      return [];
    }

    filter.employee = employee;
  }

  if (status !== undefined) {
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
  } else {
    const today = new Date();
    const fromMonth =
      today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

    filter.fineDate = {
      $gte: new Date(today.getFullYear(), fromMonth, 10, 0, 0, 0, 0),
      $lte: today,
    };
  }

  if (search?.trim()) {
    const term = search.trim();

    const matchingEmployees = await Employee.find({
      $or: [
        { empId: { $regex: term, $options: "i" } },
        { name: { $regex: term, $options: "i" } },
      ],
      ...(scopedIds !== null ? { _id: { $in: scopedIds } } : {}),
      ...(employee !== undefined ? { _id: employee } : {}),
    }).select("_id");

    const matchingIds = matchingEmployees.map((entry) => entry._id);

    if (filter.employee && !Array.isArray(filter.employee.$in)) {
      if (!matchingIds.some((id) => String(id) === String(filter.employee))) {
        return [];
      }
      filter.employee = { $in: matchingIds };
    } else {
      const existingIds = filter.employee?.$in;

      filter.employee = {
        $in: existingIds
          ? matchingIds.filter((id) =>
              existingIds.some((existing) => String(existing) === String(id)),
            )
          : matchingIds,
      };
    }
  }

  return populateFine(Fine.find(filter).sort({ fineDate: -1, createdAt: -1 }));
};

// EMPLOYEE HISTORY
export const getEmployeeFinesService = async (employeeId, areaScope) => {
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

  const fines = await Fine.find({ employee: employeeId })
    .sort({ fineDate: -1, createdAt: -1 })
    .populate("createdBy", "name userId")
    .populate("updatedBy", "name userId");

  return { employee, fines };
};

// SHARED LOOKUP
const findFineForAccess = async (id, areaScope) => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid fine ID");
  }

  const fine = await Fine.findById(id).populate("employee", "area");

  if (!fine) {
    throw new ApiError(404, "Fine not found");
  }

  if (!hasAreaAccess(fine.employee?.area, areaScope)) {
    throw new ApiError(403, "Unauthorized area access");
  }

  return fine;
};

// UPDATE
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

  fine.updatedBy = user.id;
  await fine.save();

  return populateFine(Fine.findById(fine._id));
};

// CANCEL
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
