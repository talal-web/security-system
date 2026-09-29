import mongoose from "mongoose";

import Payroll from "../../models/Payroll.js";
import Employee from "../../models/Employee.js";

const resolveAreaEmployeeIds = async (areaScope) => {
  // No scope means unrestricted access.
  // Pass the scope from your authorization middleware.
  if (!areaScope) return null;

  const areaIds = Array.isArray(areaScope) ? areaScope : areaScope.areaIds;

  if (!Array.isArray(areaIds)) {
    throw new Error("Invalid area scope");
  }

  if (areaIds.length === 0) return [];

  const employees = await Employee.find({
    area: { $in: areaIds },
  })
    .select("_id")
    .lean();

  return employees.map((employee) => employee._id);
};

const applyAreaScope = async (filter, areaScope) => {
  const employeeIds = await resolveAreaEmployeeIds(areaScope);

  if (employeeIds === null) return filter;

  const existingEmployee = filter.employee;

  if (Array.isArray(existingEmployee?.$in)) {
    const allowed = new Set(employeeIds.map(String));
    filter.employee.$in = existingEmployee.$in.filter((id) =>
      allowed.has(String(id)),
    );
  } else if (existingEmployee) {
    if (!employeeIds.some((id) => String(id) === String(existingEmployee))) {
      filter.employee = { $in: [] };
    }
  } else {
    filter.employee = { $in: employeeIds };
  }

  return filter;
};

export const getPayrollsService = async (query, areaScope) => {
  const { year, month, employee, status, search } = query;
  const filter = {};

  if (year !== undefined) {
    const parsedYear = Number(year);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 2000 ||
      parsedYear > 2100
    ) {
      throw Object.assign(new Error("Invalid year"), { status: 400 });
    }

    filter.year = parsedYear;
  }

  if (month !== undefined) {
    const parsedMonth = Number(month);

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      throw Object.assign(new Error("Invalid month"), { status: 400 });
    }

    filter.month = parsedMonth;
  }

  if (employee !== undefined) {
    if (!mongoose.isValidObjectId(employee)) {
      throw Object.assign(new Error("Invalid employee ID"), {
        status: 400,
      });
    }

    filter.employee = employee;
  }

  if (status !== undefined && status !== "all") {
    const allowedStatuses = ["draft", "finalized", "paid"];

    if (!allowedStatuses.includes(status)) {
      throw Object.assign(new Error("Invalid payroll status"), {
        status: 400,
      });
    }

    filter.status = status;
  }

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    const matchingEmployees = await Employee.find({
      $or: [{ name: searchRegex }, { empId: searchRegex }],
    })
      .select("_id")
      .lean();

    const employeeIds = matchingEmployees.map((item) => item._id);

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

  await applyAreaScope(filter, areaScope);

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

export const getPayrollByIdService = async (id, areaScope) => {
  if (!mongoose.isValidObjectId(id)) {
    throw Object.assign(new Error("Invalid payroll ID"), {
      status: 400,
    });
  }

  const filter = { _id: id };
  await applyAreaScope(filter, areaScope);

  const payroll = await Payroll.findOne(filter)
    .populate(
      "employee",
      "empId name fatherName designation status entryDate exitDate",
    )
    .populate("finalizedBy", "userId role")
    .populate("paidBy", "userId role");

  if (!payroll) {
    throw Object.assign(new Error("Payroll not found"), {
      status: 404,
    });
  }

  return payroll;
};

export const getEmployeePayrollsService = async (employeeId, areaScope) => {
  if (!mongoose.isValidObjectId(employeeId)) {
    throw Object.assign(new Error("Invalid employee ID"), {
      status: 400,
    });
  }

  const employeeIds = await resolveAreaEmployeeIds(areaScope);

  if (
    employeeIds !== null &&
    !employeeIds.some((id) => String(id) === String(employeeId))
  ) {
    throw Object.assign(new Error("Employee not found"), {
      status: 404,
    });
  }

  return Payroll.find({ employee: employeeId })
    .sort({ year: -1, month: -1 })
    .populate("employee", "empId name fatherName designation status")
    .populate("finalizedBy", "userId name role")
    .populate("paidBy", "userId name role");
};
