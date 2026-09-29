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

// Get Attendance By ID
export const getAttendanceByIdService = async ({ id }) => {
  validateObjectId(id, "Invalid attendance ID");

  const attendance = await Attendance.findById(id).lean();

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  return {
    success: true,
    message: "Attendance record fetched successfully",
    data: attendance,
  };
};

// Update Attendance
export const updateAttendanceService = async ({
  id,
  user,
  areaScope,
  body,
}) => {
  validateObjectId(id, "Invalid attendance ID");

  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  if (user && user.role !== "admin" && user.role !== "developer") {
    const permittedAreaIds = areaScope?.permittedAreaIds || [];

    const employee = await Employee.findById(attendance.employee)
      .select("area")
      .lean();

    const employeeArea = employee?.area?.toString() || "";

    if (!employeeArea || !permittedAreaIds.includes(employeeArea)) {
      throw new ApiError(403, "Unauthorized area access");
    }
  }

  const { status, shift, location, remarks } = body;

  validateAttendanceStatus(status);

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

        const locationDoc = await Location.findById(location)
          .select("_id name sector isActive")
          .populate({
            path: "sector",
            select: "_id name",
          });

        if (!locationDoc) {
          throw new ApiError(404, "Location not found");
        }

        if (!locationDoc.isActive) {
          throw new ApiError(400, "Location is inactive");
        }

        const employee = await Employee.findById(attendance.employee).select(
          "sector",
        );

        const employeeSectorId = employee?.sector?.toString();
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
          sector: locationDoc.sector?._id
            ? locationDoc.sector._id.toString()
            : "",
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

// Get Attendance Session
export const getAttendanceSessionService = async ({ areaScope = {} }) => {
  return buildAttendanceSession(areaScope);
};

// Submit Attendance Session
export const submitAttendanceSessionService = async ({ body }) => {
  const { date, employees } = body;

  validateEmployeesArray(employees);

  const attendanceDate = validateAttendanceDate(date, normalizeDate);
  const employeeIds = validateAttendanceItems(employees);

  const locationIds = [
    ...new Set(
      employees
        .filter((emp) => emp.status === "present" && emp.locationId)
        .map((emp) => emp.locationId.toString()),
    ),
  ];

  const employeeDocs = await Employee.find({
    _id: { $in: employeeIds },
    status: "active",
  })
    .select(
      "empId name fatherName designation defaultShift sector currentLocation",
    )
    .populate({
      path: "currentLocation",
      select: "name sector isActive",
      populate: {
        path: "sector",
        select: "_id name",
      },
    });

  const locationDocs = await Location.find({
    _id: { $in: locationIds },
  })
    .select("name sector isActive")
    .populate({
      path: "sector",
      select: "_id name",
    });

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const locationMap = new Map(
    locationDocs.map((location) => [location._id.toString(), location]),
  );

  const invalidEmployees = [];

  for (const attendance of employees) {
    const employeeId = attendance.employeeId.toString();
    const employee = employeeMap.get(employeeId);

    if (!employee) {
      invalidEmployees.push({
        employeeId,
        missing: ["Employee not found or inactive"],
      });
      continue;
    }

    if (attendance.status === "present") {
      const missingReasons = [];

      if (!attendance.shift) {
        missingReasons.push("Shift");
      }

      if (!attendance.locationId) {
        missingReasons.push("Location");
      }

      const location = attendance.locationId
        ? locationMap.get(attendance.locationId.toString())
        : null;

      if (attendance.locationId && !location) {
        missingReasons.push("Location not found");
      }

      if (location && !location.isActive) {
        missingReasons.push("Location is inactive");
      }

      if (location && employee.sector) {
        const employeeSectorId = employee.sector.toString();
        const locationSectorId = location.sector?._id?.toString();

        if (locationSectorId && employeeSectorId !== locationSectorId) {
          missingReasons.push("Location does not belong to employee's sector");
        }
      }

      if (missingReasons.length > 0) {
        invalidEmployees.push({
          employeeId: employee._id,
          empId: employee.empId,
          employeeName: employee.name,
          missing: missingReasons,
        });
      }
    }
  }

  if (invalidEmployees.length > 0) {
    throw new ApiError(400, "Some employees have invalid attendance data.", {
      employees: invalidEmployees,
    });
  }

  const operations = employees.map((attendance) => {
    const employeeId = attendance.employeeId.toString();
    const employee = employeeMap.get(employeeId);

    const location = attendance.locationId
      ? locationMap.get(attendance.locationId.toString())
      : null;

    const isPresent = attendance.status === "present";

    const locationSnapshot =
      isPresent && location
        ? {
            locationId: location._id,
            name: location.name,
            sector: toSnapshotSectorId(location.sector),
          }
        : employee.currentLocation
          ? {
              locationId: employee.currentLocation._id,
              name: employee.currentLocation.name,
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
            employeeSnapshot: {
              empId: employee.empId,
              name: employee.name,
              fatherName: employee.fatherName,
              designation: employee.designation,
            },
            date: attendanceDate,
            status: attendance.status,
            shift: isPresent ? attendance.shift : null,
            location: isPresent ? location?._id : null,
            locationSnapshot,
            remarks:
              typeof attendance.remarks === "string"
                ? attendance.remarks.trim()
                : "",
          },
        },
        upsert: true,
      },
    };
  });

  await Attendance.bulkWrite(operations);

  return {
    success: true,
    message: "Attendance marked successfully",
    date: attendanceDate,
    totalEmployees: employees.length,
  };
};

// Update Employee Locations
export const updateEmployeeLocationsService = async ({
  body,
  areaScope = {},
}) => {
  const { employees } = body;

  validateEmployeesArray(employees);

  for (const item of employees) {
    validateObjectId(item.employeeId, "Invalid employee ID");
    validateObjectId(item.locationId, "Invalid location ID");
  }

  const employeeIds = employees.map((emp) => emp.employeeId);

  const allowedAreaIds =
    areaScope.requestedAreaIds ?? areaScope.permittedAreaIds ?? [];

  const employeeQuery = {
    _id: { $in: employeeIds },
    status: "active",
  };

  if (allowedAreaIds.length && !areaScope.isAdmin) {
    employeeQuery.area = { $in: allowedAreaIds };
  }

  const employeeDocs = await Employee.find(employeeQuery)
    .select("currentLocation area")
    .lean();

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const locationIds = [
    ...new Set(employees.map((emp) => emp.locationId.toString())),
  ];

  const locationDocs = await Location.find({
    _id: { $in: locationIds },
    isActive: true,
  })
    .select("_id")
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
        missing: ["Employee not found"],
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

    const currentLocation = employee.currentLocation?.toString();

    if (currentLocation === locationId) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: { _id: item.employeeId },
        update: {
          $set: {
            currentLocation: item.locationId,
          },
        },
      },
    });
  }

  if (invalidEmployees.length) {
    throw new ApiError(400, "Some employees have invalid locations.", {
      employees: invalidEmployees,
    });
  }

  if (operations.length) {
    await Employee.bulkWrite(operations);
  }

  const session = await buildAttendanceSession(areaScope);

  return {
    success: true,
    message: "Employee locations updated successfully.",
    ...session,
  };
};

// Update Employee Shifts
export const updateEmployeeShiftsService = async ({ body, areaScope = {} }) => {
  const { employees } = body;

  validateEmployeesArray(employees);
  validateEmployeeShiftItems(employees);

  for (const item of employees) {
    validateObjectId(item.employeeId, "Invalid employee ID");
  }

  const employeeIds = employees.map((emp) => emp.employeeId);

  const allowedAreaIds =
    areaScope.requestedAreaIds ?? areaScope.permittedAreaIds ?? [];

  const employeeQuery = {
    _id: { $in: employeeIds },
    status: "active",
  };

  if (allowedAreaIds.length && !areaScope.isAdmin) {
    employeeQuery.area = { $in: allowedAreaIds };
  }

  const employeeDocs = await Employee.find(employeeQuery)
    .select("defaultShift area")
    .lean();

  const employeeMap = new Map(
    employeeDocs.map((emp) => [emp._id.toString(), emp]),
  );

  const invalidEmployees = [];

  for (const item of employees) {
    const employeeId = item.employeeId.toString();
    const employee = employeeMap.get(employeeId);

    if (!employee) {
      invalidEmployees.push({
        employeeId,
        missing: ["Employee not found or inactive"],
      });
    }
  }

  if (invalidEmployees.length) {
    throw new ApiError(400, "Some employees are invalid.", {
      employees: invalidEmployees,
    });
  }

  const operations = [];

  for (const item of employees) {
    const employeeId = item.employeeId.toString();
    const employee = employeeMap.get(employeeId);
    const defaultShift = employee.defaultShift;

    if (defaultShift === item.shift) {
      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          _id: item.employeeId,
          status: "active",
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

  const session = await buildAttendanceSession(areaScope);

  return {
    success: true,
    message: "Employee shifts updated successfully.",
    ...session,
  };
};
