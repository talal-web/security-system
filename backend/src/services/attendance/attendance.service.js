import ApiError from "../../utils/ApiError.js";
import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import Location from "../../models/Location.js";

import { buildAttendanceSession } from "./attendanceSession.service.js";
import { normalizeDate, toSnapshotSectorId } from "./attendance.helpers.js";

import {
  validateObjectId,
  validateAttendanceStatus,
  validateAttendanceShift,
  validateEmployeesArray,
  validateAttendanceDate,
  validateAttendanceItems,
  validateEmployeeShiftItems,
} from "./attendance.validation.js";

// ======================================
// Area Scope Helpers
// ======================================

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!OBJECT_ID_PATTERN.test(areaId.trim())) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId.trim();
};

// Scope passed to buildAttendanceSession. Keeps requestedArea for
// compatibility until that service is switched to areaId.
const toSessionScope = (areaScope, areaId) => ({
  ...areaScope,
  areaId,
  requestedArea: areaId,
});

const getEmployeeInArea = (employeeId, areaId) =>
  Employee.findOne({
    _id: employeeId,
    area: areaId,
  });

const getLocationInArea = async (locationId, areaId) => {
  const location = await Location.findById(locationId)
    .select("_id name sector isActive")
    .populate({
      path: "sector",
      select: "_id name area",
    });

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  if (!location.isActive) {
    throw new ApiError(400, "Location is inactive");
  }

  const sectorArea = location.sector?.area?.toString();

  if (!sectorArea || sectorArea !== areaId) {
    throw new ApiError(400, "Location is outside the selected area");
  }

  return location;
};

const getActiveEmployeesInArea = (employeeIds, areaId) =>
  Employee.find({
    _id: { $in: employeeIds },
    area: areaId,
    status: "active",
  })
    .select(
      "empId name fatherName designation defaultShift sector currentLocation area",
    )
    .populate({
      path: "currentLocation",
      select: "name sector isActive",
      populate: {
        path: "sector",
        select: "_id name area",
      },
    })
    .lean();

const throwInvalidEmployees = (message, invalidEmployees) => {
  throw new ApiError(400, message, {
    employees: invalidEmployees,
  });
};

// ======================================
// Get Attendance By ID
// ======================================

export const getAttendanceByIdService = async ({ id, areaScope = {} }) => {
  validateObjectId(id, "Invalid attendance ID");

  const areaId = getScopedAreaId(areaScope);

  const attendance = await Attendance.findById(id).lean();

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  if (attendance.area && attendance.area.toString() !== areaId) {
    throw new ApiError(404, "Attendance record not found");
  }

  if (!attendance.area) {
    const legacyEmployee = await Employee.exists({
      _id: attendance.employee,
      area: areaId,
    });

    // Legacy records without an area retain their former employee-area scope.
    if (!legacyEmployee) {
      throw new ApiError(404, "Attendance record not found");
    }
  }

  return {
    success: true,
    message: "Attendance record fetched successfully",
    data: attendance,
  };
};

// ======================================
// Update Attendance
// ======================================

export const updateAttendanceService = async ({
  id,
  user,
  areaScope = {},
  body = {},
}) => {
  validateObjectId(id, "Invalid attendance ID");

  const areaId = getScopedAreaId(areaScope);

  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  if (attendance.area && attendance.area.toString() !== areaId) {
    throw new ApiError(404, "Attendance record not found");
  }

  const employee = await getEmployeeInArea(attendance.employee, areaId);

  // 404 so records in other areas are not revealed.
  if (!employee) {
    throw new ApiError(404, "Attendance record not found");
  }

  if (!attendance.area) {
    attendance.area = areaId;
  }

  const { status, shift, location, remarks } = body;

  if (status !== undefined) {
    validateAttendanceStatus(status);
  }

  const finalStatus = status ?? attendance.status;

  if (finalStatus === "absent" || finalStatus === "leave") {
    attendance.status = finalStatus;
    attendance.shift = null;
    attendance.location = null;
    attendance.locationSnapshot = {
      locationId: null,
      name: "",
      sector: "",
    };
  }

  if (finalStatus === "present") {
    attendance.status = "present";

    if (shift !== undefined) {
      validateAttendanceShift(shift);
      attendance.shift = shift;
    }

    if (location !== undefined) {
      if (location === null || location === "") {
        attendance.location = null;
        attendance.locationSnapshot = {
          locationId: null,
          name: "",
          sector: "",
        };
      } else {
        validateObjectId(location, "Invalid location ID");

        const locationDoc = await getLocationInArea(location, areaId);

        const employeeSectorId = employee.sector?.toString();
        const locationSectorId = locationDoc.sector?._id?.toString();

        if (!employeeSectorId || employeeSectorId !== locationSectorId) {
          throw new ApiError(
            400,
            "Location does not belong to employee's sector",
          );
        }

        attendance.location = locationDoc._id;
        attendance.locationSnapshot = {
          locationId: locationDoc._id,
          name: locationDoc.name || "",
          sector: locationSectorId || "",
        };
      }
    }

    if (!attendance.shift || !attendance.location) {
      throw new ApiError(
        400,
        "Present attendance requires a shift and location",
      );
    }
  }

  if (remarks !== undefined) {
    attendance.remarks = typeof remarks === "string" ? remarks.trim() : "";
  }

  await attendance.save();

  return {
    success: true,
    message: "Attendance updated successfully",
    data: attendance,
  };
};

// ======================================
// Get Attendance Session
// ======================================

export const getAttendanceSessionService = async ({ areaScope = {} }) => {
  const areaId = getScopedAreaId(areaScope);

  return buildAttendanceSession(toSessionScope(areaScope, areaId));
};

// ======================================
// Submit Attendance Session
// ======================================

export const submitAttendanceSessionService = async ({
  body = {},
  areaScope = {},
}) => {
  const areaId = getScopedAreaId(areaScope);
  const { date, employees } = body;

  validateEmployeesArray(employees);

  const attendanceDate = validateAttendanceDate(date, normalizeDate);

  const employeeIds = validateAttendanceItems(employees);

  const employeeDocs = await getActiveEmployeesInArea(employeeIds, areaId);

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const locationIds = [
    ...new Set(
      employees
        .filter((item) => item.status === "present" && item.locationId)
        .map((item) => item.locationId.toString()),
    ),
  ];

  const locationDocs = locationIds.length
    ? await Location.find({
        _id: { $in: locationIds },
        isActive: true,
      })
        .select("_id name sector isActive")
        .populate({
          path: "sector",
          select: "_id name area",
        })
        .lean()
    : [];

  const locationMap = new Map(
    locationDocs.map((location) => [location._id.toString(), location]),
  );

  const invalidEmployees = [];

  for (const item of employees) {
    const employeeId = item.employeeId.toString();
    const employee = employeeMap.get(employeeId);

    if (!employee) {
      invalidEmployees.push({
        employeeId,
        missing: ["Employee not found, inactive, or outside selected area"],
      });
      continue;
    }

    if (item.status === "present") {
      const missingReasons = [];

      if (!item.shift) {
        missingReasons.push("Shift");
      } else {
        try {
          validateAttendanceShift(item.shift);
        } catch {
          missingReasons.push("Invalid shift");
        }
      }

      if (!item.locationId) {
        missingReasons.push("Location");
      }

      const location = item.locationId
        ? locationMap.get(item.locationId.toString())
        : null;

      if (item.locationId && !location) {
        missingReasons.push("Location not found or inactive");
      }

      if (location) {
        const locationArea = location.sector?.area?.toString();

        if (locationArea !== areaId) {
          missingReasons.push("Location is outside the selected area");
        }

        const employeeSectorId = employee.sector?.toString();
        const locationSectorId = location.sector?._id?.toString();

        if (
          !employeeSectorId ||
          !locationSectorId ||
          employeeSectorId !== locationSectorId
        ) {
          missingReasons.push("Location does not belong to employee's sector");
        }
      }

      if (missingReasons.length) {
        invalidEmployees.push({
          employeeId: employee._id,
          empId: employee.empId,
          employeeName: employee.name,
          missing: missingReasons,
        });
      }
    } else if (item.status !== "absent" && item.status !== "leave") {
      invalidEmployees.push({
        employeeId,
        missing: ["Invalid attendance status"],
      });
    }
  }

  if (invalidEmployees.length) {
    throwInvalidEmployees(
      "Some employees have invalid attendance data.",
      invalidEmployees,
    );
  }

  const operations = employees.map((item) => {
    const employee = employeeMap.get(item.employeeId.toString());

    const location = item.locationId
      ? locationMap.get(item.locationId.toString())
      : null;

    const isPresent = item.status === "present";

    const locationSnapshot =
      isPresent && location
        ? {
            locationId: location._id,
            name: location.name || "",
            sector: toSnapshotSectorId(location.sector),
          }
        : employee.currentLocation
          ? {
              locationId: employee.currentLocation._id,
              name: employee.currentLocation.name || "",
              sector: toSnapshotSectorId(employee.currentLocation.sector),
            }
          : {
              locationId: null,
              name: "",
              sector: "",
            };

    return {
      updateOne: {
        filter: {
          employee: employee._id,
          date: attendanceDate,
        },
        update: {
          $set: {
            employee: employee._id,
            area: areaId,
            employeeSnapshot: {
              empId: employee.empId,
              name: employee.name,
              fatherName: employee.fatherName,
              designation: employee.designation,
            },
            date: attendanceDate,
            status: item.status,
            shift: isPresent ? item.shift : null,
            location: isPresent ? location?._id : null,
            locationSnapshot,
            remarks:
              typeof item.remarks === "string" ? item.remarks.trim() : "",
          },
        },
        upsert: true,
      },
    };
  });

  if (operations.length) {
    await Attendance.bulkWrite(operations);
  }

  return {
    success: true,
    message: "Attendance marked successfully",
    date: attendanceDate,
    totalEmployees: employees.length,
  };
};

// ======================================
// Update Employee Locations
// ======================================

export const updateEmployeeLocationsService = async ({
  body = {},
  areaScope = {},
}) => {
  const areaId = getScopedAreaId(areaScope);
  const { employees } = body;

  validateEmployeesArray(employees);

  for (const item of employees) {
    validateObjectId(item.employeeId, "Invalid employee ID");
    validateObjectId(item.locationId, "Invalid location ID");
  }

  const employeeIds = employees.map((item) => item.employeeId);

  const employeeDocs = await Employee.find({
    _id: { $in: employeeIds },
    status: "active",
    area: areaId,
  })
    .select("currentLocation area sector")
    .lean();

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const locationIds = [
    ...new Set(employees.map((item) => item.locationId.toString())),
  ];

  const locationDocs = await Location.find({
    _id: { $in: locationIds },
    isActive: true,
  })
    .select("_id sector isActive")
    .populate({
      path: "sector",
      select: "_id area",
    })
    .lean();

  const locationMap = new Map(
    locationDocs.map((loc) => [loc._id.toString(), loc]),
  );

  const invalidEmployees = [];
  const operations = [];

  for (const item of employees) {
    const employeeId = item.employeeId.toString();
    const locationId = item.locationId.toString();

    const employee = employeeMap.get(employeeId);

    if (!employee) {
      invalidEmployees.push({
        employeeId,
        missing: ["Employee not found, inactive, or outside selected area"],
      });
      continue;
    }

    const location = locationMap.get(locationId);

    if (!location) {
      invalidEmployees.push({
        employeeId,
        missing: ["Location not found or inactive"],
      });
      continue;
    }

    if (location.sector?.area?.toString() !== areaId) {
      invalidEmployees.push({
        employeeId,
        missing: ["Location is outside the selected area"],
      });
      continue;
    }

    const employeeSectorId = employee.sector?.toString();
    const locationSectorId = location.sector?._id?.toString();

    if (!employeeSectorId || employeeSectorId !== locationSectorId) {
      invalidEmployees.push({
        employeeId,
        missing: ["Location does not belong to employee's sector"],
      });
      continue;
    }

    if (employee.currentLocation?.toString() === locationId) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          _id: item.employeeId,
          area: areaId,
          status: "active",
        },
        update: {
          $set: {
            currentLocation: item.locationId,
          },
        },
      },
    });
  }

  if (invalidEmployees.length) {
    throwInvalidEmployees(
      "Some employees have invalid locations.",
      invalidEmployees,
    );
  }

  if (operations.length) {
    await Employee.bulkWrite(operations);
  }

  const session = await buildAttendanceSession(
    toSessionScope(areaScope, areaId),
  );

  return {
    success: true,
    message: "Employee locations updated successfully.",
    ...session,
  };
};

// ======================================
// Update Employee Shifts
// ======================================

export const updateEmployeeShiftsService = async ({
  body = {},
  areaScope = {},
}) => {
  const areaId = getScopedAreaId(areaScope);
  const { employees } = body;

  validateEmployeesArray(employees);
  validateEmployeeShiftItems(employees);

  for (const item of employees) {
    validateObjectId(item.employeeId, "Invalid employee ID");
  }

  const employeeIds = employees.map((item) => item.employeeId);

  const employeeDocs = await Employee.find({
    _id: { $in: employeeIds },
    status: "active",
    area: areaId,
  })
    .select("defaultShift area")
    .lean();

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const invalidEmployees = [];

  for (const item of employees) {
    const employeeId = item.employeeId.toString();

    if (!employeeMap.has(employeeId)) {
      invalidEmployees.push({
        employeeId,
        missing: ["Employee not found, inactive, or outside selected area"],
      });
    }
  }

  if (invalidEmployees.length) {
    throwInvalidEmployees("Some employees are invalid.", invalidEmployees);
  }

  const operations = [];

  for (const item of employees) {
    const employee = employeeMap.get(item.employeeId.toString());

    if (employee.defaultShift === item.shift) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          _id: item.employeeId,
          status: "active",
          area: areaId,
        },
        update: {
          $set: {
            defaultShift: item.shift,
          },
        },
      },
    });
  }

  if (operations.length) {
    await Employee.bulkWrite(operations);
  }

  const session = await buildAttendanceSession(
    toSessionScope(areaScope, areaId),
  );

  return {
    success: true,
    message: "Employee shifts updated successfully.",
    ...session,
  };
};
