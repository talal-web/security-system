import mongoose from "mongoose";
import ApiError from "../../utils/ApiError.js";

const ALLOWED_STATUSES = ["present", "absent", "leave"];
const ALLOWED_SHIFTS = ["day", "night"];

export const validateObjectId = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message);
  }
};

export const validateAttendanceStatus = (status) => {
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
    );
  }
};

export const validateAttendanceShift = (shift) => {
  if (!ALLOWED_SHIFTS.includes(shift)) {
    throw new ApiError(400, "Shift must be either day or night");
  }
};

export const validateEmployeesArray = (employees) => {
  if (!Array.isArray(employees) || employees.length === 0) {
    throw new ApiError(400, "Employees data is required");
  }
};

export const validateAttendanceDate = (date, normalizeDate) => {
  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  const attendanceDate = normalizeDate(date);
  const today = normalizeDate(new Date());

  if (attendanceDate !== today) {
    throw new ApiError(400, "Attendance can only be marked for today.");
  }

  return attendanceDate;
};

export const validateAttendanceItems = (employees) => {
  const employeeIds = [];
  const seenEmployeeIds = new Set();
  const invalidRequestEmployees = [];

  for (const emp of employees) {
    const employeeId = emp?.employeeId?.toString();

    if (!employeeId) {
      invalidRequestEmployees.push({
        employeeId: null,
        missing: ["Employee ID"],
      });
      continue;
    }

    if (seenEmployeeIds.has(employeeId)) {
      invalidRequestEmployees.push({
        employeeId,
        missing: ["Duplicate employee"],
      });
      continue;
    }

    seenEmployeeIds.add(employeeId);
    employeeIds.push(employeeId);

    if (!ALLOWED_STATUSES.includes(emp.status)) {
      invalidRequestEmployees.push({
        employeeId,
        missing: [
          `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        ],
      });
      continue;
    }

    if (emp.status === "present") {
      if (!ALLOWED_SHIFTS.includes(emp.shift)) {
        invalidRequestEmployees.push({
          employeeId,
          missing: [
            `Invalid shift. Allowed values: ${ALLOWED_SHIFTS.join(", ")}`,
          ],
        });
      }

      if (!emp.locationId) {
        invalidRequestEmployees.push({
          employeeId,
          missing: ["Location"],
        });
      }
    }

    if (emp.status === "absent" || emp.status === "leave") {
      if (emp.shift != null) {
        invalidRequestEmployees.push({
          employeeId,
          missing: ["Shift must be empty for absent/leave"],
        });
      }

      if (emp.locationId != null) {
        invalidRequestEmployees.push({
          employeeId,
          missing: ["Location must be empty for absent/leave"],
        });
      }
    }
  }

  if (invalidRequestEmployees.length > 0) {
    throw new ApiError(400, "Invalid attendance data.", {
      employees: invalidRequestEmployees,
    });
  }

  return employeeIds;
};

export const validateEmployeeShiftItems = (employees) => {
  const invalidEmployees = [];

  for (const item of employees) {
    if (!item.employeeId) {
      invalidEmployees.push({
        employeeId: item.employeeId ?? null,
        missing: ["Employee ID is required"],
      });

      continue;
    }

    if (!ALLOWED_SHIFTS.includes(item.shift)) {
      invalidEmployees.push({
        employeeId: item.employeeId,
        missing: ["Shift must be either day or night"],
      });
    }
  }

  if (invalidEmployees.length) {
    throw new ApiError(400, "Some employees have invalid shifts.", {
      employees: invalidEmployees,
    });
  }
};

export const validateMonth = (month) => {
  if (!month) {
    throw new ApiError(400, "Month is required.");
  }

  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (!regex.test(month)) {
    throw new ApiError(400, "Month format must be YYYY-MM");
  }

  return month;
};
