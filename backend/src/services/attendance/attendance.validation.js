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

// Per-item status/shift/locationId format and presence rules are
// validated by submitAttendanceSessionSchema (http/validators/
// attendanceSchemas.js) before this runs. This only rejects duplicate
// employee IDs within the batch and extracts the deduped ID list.
export const validateAttendanceItems = (employees) => {
  const employeeIds = [];
  const seenEmployeeIds = new Set();
  const invalidRequestEmployees = [];

  for (const emp of employees) {
    const employeeId = emp.employeeId.toString();

    if (seenEmployeeIds.has(employeeId)) {
      invalidRequestEmployees.push({
        employeeId,
        missing: ["Duplicate employee"],
      });
      continue;
    }

    seenEmployeeIds.add(employeeId);
    employeeIds.push(employeeId);
  }

  if (invalidRequestEmployees.length > 0) {
    throw new ApiError(400, "Invalid attendance data.", {
      employees: invalidRequestEmployees,
    });
  }

  return employeeIds;
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
