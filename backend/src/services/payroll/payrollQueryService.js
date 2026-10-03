import mongoose from "mongoose";

import Payroll from "../../models/Payroll.js";
import Employee from "../../models/Employee.js";
import ApiError from "../../utils/ApiError.js";

// ======================================
// Area scope helper
// ======================================

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth. Payrolls are filtered
// by their stored area, so a missing scope fails closed.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!mongoose.isValidObjectId(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

// ======================================
// Get payrolls
// ======================================

export const getPayrollsService = async (query = {}, areaScope = {}) => {
  const { year, month, employee, status, search } = query;

  // Always limited to the single selected area.
  const filter = { area: getScopedAreaId(areaScope) };

  if (year !== undefined) {
    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      throw new ApiError(400, "Invalid year");
    }

    filter.year = parsedYear;
  }

  if (month !== undefined) {
    const parsedMonth = Number(month);

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      throw new ApiError(400, "Invalid month");
    }

    filter.month = parsedMonth;
  }

  if (employee !== undefined) {
    if (!mongoose.isValidObjectId(employee)) {
      throw new ApiError(400, "Invalid employee ID");
    }

    filter.employee = employee;
  }

  if (status !== undefined && status !== "all") {
    const allowedStatuses = ["draft", "finalized", "paid"];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Invalid payroll status");
    }

    filter.status = status;
  }

  if (typeof search === "string" && search.trim()) {
    // Escape regex special characters so user input is treated as text.
    const searchTerm = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Not limited by the employee's current area: the payroll's stored
    // area in the filter already restricts results, which also keeps
    // payrolls of employees who moved searchable.
    const employeeIds = await Employee.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { empId: { $regex: searchTerm, $options: "i" } },
      ],
    }).distinct("_id");

    if (employeeIds.length === 0) return [];

    if (filter.employee) {
      const matchesSelectedEmployee = employeeIds.some(
        (id) => String(id) === String(filter.employee),
      );

      if (!matchesSelectedEmployee) return [];
    } else {
      filter.employee = { $in: employeeIds };
    }
  }

  const payrolls = await Payroll.find(filter)
    .populate("employee", "empId name fatherName designation status")
    .populate("finalizedBy", "userId name role")
    .populate("paidBy", "userId name role")
    .lean();

  payrolls.sort((a, b) =>
    String(a.employee?.empId ?? "").localeCompare(
      String(b.employee?.empId ?? ""),
      undefined,
      { numeric: true, sensitivity: "base" },
    ),
  );

  return payrolls;
};

// ======================================
// Get one payroll
// ======================================

export const getPayrollByIdService = async (id, areaScope = {}) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid payroll ID");
  }

  // Returns 404 so payrolls in other areas are not revealed.
  const payroll = await Payroll.findOne({
    _id: id,
    area: getScopedAreaId(areaScope),
  })
    .populate(
      "employee",
      "empId name fatherName designation status entryDate exitDate",
    )
    .populate("finalizedBy", "userId role")
    .populate("paidBy", "userId role");

  if (!payroll) {
    throw new ApiError(404, "Payroll not found");
  }

  return payroll;
};

// ======================================
// Get one employee's payrolls
// ======================================

export const getEmployeePayrollsService = async (
  employeeId,
  areaScope = {},
) => {
  if (!mongoose.isValidObjectId(employeeId)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const areaId = getScopedAreaId(areaScope);

  // Payroll records are filtered by their stored area.
  const payrolls = await Payroll.find({
    employee: employeeId,
    area: areaId,
  })
    .sort({ year: -1, month: -1 })
    .populate("employee", "empId name fatherName designation status")
    .populate("finalizedBy", "userId name role")
    .populate("paidBy", "userId name role");

  // Don't reveal an employee from another area unless they currently
  // belong to the selected area (an empty history is valid there).
  if (payrolls.length === 0) {
    const inArea = await Employee.exists({ _id: employeeId, area: areaId });

    if (!inArea) {
      throw new ApiError(404, "Employee not found");
    }
  }

  return payrolls;
};
