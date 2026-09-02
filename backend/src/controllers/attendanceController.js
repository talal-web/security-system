import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Location from "../models/Location.js";
import { buildAttendanceSession } from "../services/attendanceSession.service.js";

// POST /api/attendance
const normalizeDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format");
  }
  return parsed.toISOString().split("T")[0];
};

const toSnapshotSectorId = (sector) => {
  if (!sector) {
    return "";
  }

  if (typeof sector === "string") {
    return sector;
  }

  if (sector._id) {
    return sector._id.toString();
  }

  if (typeof sector.toString === "function") {
    return sector.toString();
  }

  return "";
};

// GET /api/attendance
export const getAttendanceReport = async (req, res) => {
  try {
    const { status, shift, date } = req.query;

    const match = {};

    if (status) match.status = status;
    if (shift) match.shift = shift;

    match.date = date ? normalizeDate(date) : normalizeDate(new Date());

    const data = await Attendance.aggregate([
      // ==========================================
      // MATCH ATTENDANCE
      // ==========================================
      { $match: match },

      // ==========================================
      // JOIN LOCATION
      // ==========================================
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },

      {
        $unwind: {
          path: "$location",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ==========================================
      // RESOLVE SNAPSHOT SECTOR ID
      // ==========================================
      {
        $addFields: {
          snapshotSectorId: {
            $convert: {
              input: "$locationSnapshot.sector",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },

      // ==========================================
      // JOIN CURRENT LOCATION SECTOR
      // ==========================================
      {
        $lookup: {
          from: "sectors",
          localField: "location.sector",
          foreignField: "_id",
          as: "locationSector",
        },
      },

      {
        $unwind: {
          path: "$locationSector",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ==========================================
      // JOIN SNAPSHOT SECTOR
      // ==========================================
      {
        $lookup: {
          from: "sectors",
          localField: "snapshotSectorId",
          foreignField: "_id",
          as: "snapshotSector",
        },
      },

      {
        $unwind: {
          path: "$snapshotSector",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ==========================================
      // RESOLVE FINAL SECTOR
      // ==========================================
      {
        $addFields: {
          resolvedSectorId: {
            $ifNull: ["$location.sector", "$snapshotSectorId"],
          },

          resolvedSectorName: {
            $ifNull: [
              "$locationSector.name",
              "$snapshotSector.name",
              "$locationSnapshot.sector",
              "Unassigned",
            ],
          },
        },
      },

      // ==========================================
      // REPORT FACETS
      // ==========================================
      {
        $facet: {
          // ======================================
          // GLOBAL STATS
          // ======================================
          globalStats: [
            {
              $group: {
                _id: null,

                total: {
                  $sum: {
                    $cond: [
                      {
                        $in: ["$status", ["present", "leave"]],
                      },
                      1,
                      0,
                    ],
                  },
                },

                present: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "present"] }, 1, 0],
                  },
                },

                absent: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "absent"] }, 1, 0],
                  },
                },

                leave: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "leave"] }, 1, 0],
                  },
                },

                day: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$status", "present"] },
                          { $eq: ["$shift", "day"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                night: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$status", "present"] },
                          { $eq: ["$shift", "night"] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },

            {
              $project: {
                _id: 0,
              },
            },
          ],

          // ======================================
          // PRESENT
          // ======================================
          presentSectors: [
            {
              $match: {
                status: "present",
              },
            },

            {
              $sort: {
                resolvedSectorName: 1,
                "location.sortOrder": 1,
                "employeeSnapshot.empId": 1,
              },
            },

            // ------------------------------------
            // GROUP EMPLOYEES BY SECTOR + LOCATION
            // ------------------------------------
            {
              $group: {
                _id: {
                  sectorId: "$resolvedSectorId",
                  locationId: "$locationSnapshot.locationId",
                },

                sectorId: {
                  $first: "$resolvedSectorId",
                },

                sector: {
                  $first: "$resolvedSectorName",
                },

                locationId: {
                  $first: "$locationSnapshot.locationId",
                },

                locationName: {
                  $first: "$locationSnapshot.name",
                },

                sortOrder: {
                  $first: {
                    $ifNull: ["$location.sortOrder", 999999],
                  },
                },

                isActive: {
                  $first: {
                    $ifNull: ["$location.isActive", false],
                  },
                },

                records: {
                  $push: {
                    attendanceId: "$_id",

                    employeeId: "$employee",

                    empId: "$employeeSnapshot.empId",

                    name: "$employeeSnapshot.name",

                    fatherName: "$employeeSnapshot.fatherName",

                    designation: "$employeeSnapshot.designation",

                    shift: "$shift",

                    status: "$status",

                    date: "$date",

                    remarks: "$remarks",
                  },
                },
              },
            },

            // ------------------------------------
            // SORT LOCATIONS
            // ------------------------------------
            {
              $sort: {
                sector: 1,
                sortOrder: 1,
              },
            },

            // ------------------------------------
            // GROUP LOCATIONS BY SECTOR
            // ------------------------------------
            {
              $group: {
                _id: "$sectorId",

                sectorId: {
                  $first: "$sectorId",
                },

                sector: {
                  $first: "$sector",
                },

                locations: {
                  $push: {
                    _id: "$locationId",

                    name: "$locationName",

                    sortOrder: "$sortOrder",

                    isActive: "$isActive",

                    totalEmployees: {
                      $size: "$records",
                    },

                    records: "$records",
                  },
                },
              },
            },

            // ------------------------------------
            // FINAL SECTOR SHAPE
            // ------------------------------------
            {
              $project: {
                _id: 0,

                sectorId: 1,

                sector: 1,

                locations: 1,
              },
            },

            {
              $sort: {
                sector: 1,
              },
            },
          ],

          // ======================================
          // ABSENT
          // ======================================
          absentEmployees: [
            {
              $match: {
                status: "absent",
              },
            },

            {
              $project: {
                _id: 0,

                attendanceId: "$_id",

                employeeId: "$employee",

                empId: "$employeeSnapshot.empId",

                name: "$employeeSnapshot.name",

                fatherName: "$employeeSnapshot.fatherName",

                designation: "$employeeSnapshot.designation",

                sectorId: "$resolvedSectorId",

                sector: "$resolvedSectorName",

                location: "$locationSnapshot.name",

                shift: "$shift",

                date: "$date",

                remarks: "$remarks",
              },
            },

            {
              $sort: {
                empId: 1,
              },
            },
          ],

          // ======================================
          // LEAVE
          // ======================================
          leaveEmployees: [
            {
              $match: {
                status: "leave",
              },
            },

            {
              $project: {
                _id: 0,

                attendanceId: "$_id",

                employeeId: "$employee",

                empId: "$employeeSnapshot.empId",

                name: "$employeeSnapshot.name",

                fatherName: "$employeeSnapshot.fatherName",

                designation: "$employeeSnapshot.designation",

                sectorId: "$resolvedSectorId",

                sector: "$resolvedSectorName",

                location: "$locationSnapshot.name",

                shift: "$shift",

                date: "$date",

                remarks: "$remarks",
              },
            },

            {
              $sort: {
                empId: 1,
              },
            },
          ],
        },
      },
    ]);

    const report = data[0];

    return res.status(200).json({
      success: true,
      message: "Attendance report fetched successfully",

      data: {
        globalStats: report.globalStats[0] || {
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
          day: 0,
          night: 0,
        },

        presentSectors: report.presentSectors,

        absentEmployees: report.absentEmployees,

        leaveEmployees: report.leaveEmployees,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ATTENDANCE SESSION
// ======================================

export const getAttendanceSession = async (req, res) => {
  try {
    const session = await buildAttendanceSession();

    return res.status(200).json({
      success: true,

      ...session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
// ======================================
// MARK ATTENDANCE SESSION
// ======================================
export const submitAttendanceSession = async (req, res) => {
  try {
    const { date, employees } = req.body;

    // ============================================================
    // 1. BASIC REQUEST VALIDATION
    // ============================================================

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Employees data is required",
      });
    }

    // ============================================================
    // 2. NORMALIZE DATE
    // ============================================================

    let attendanceDate;

    try {
      attendanceDate = normalizeDate(date);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance date",
      });
    }

    // ============================================================
    // 3. ATTENDANCE CAN ONLY BE MARKED FOR TODAY
    // ============================================================

    const today = normalizeDate(new Date());

    if (attendanceDate !== today) {
      return res.status(400).json({
        success: false,
        message: "Attendance can only be marked for today.",
      });
    }

    // ============================================================
    // 4. VALIDATE STATUS, SHIFT AND EMPLOYEE IDS
    // ============================================================

    const allowedStatuses = ["present", "absent", "leave"];
    const allowedShifts = ["day", "night"];

    const employeeIds = [];
    const seenEmployeeIds = new Set();
    const invalidRequestEmployees = [];

    for (const emp of employees) {
      const employeeId = emp?.employeeId?.toString();

      // ----------------------------------------------------------
      // Employee ID required
      // ----------------------------------------------------------

      if (!employeeId) {
        invalidRequestEmployees.push({
          employeeId: null,
          missing: ["Employee ID"],
        });

        continue;
      }

      // ----------------------------------------------------------
      // Duplicate employee check
      // ----------------------------------------------------------

      if (seenEmployeeIds.has(employeeId)) {
        invalidRequestEmployees.push({
          employeeId,
          missing: ["Duplicate employee"],
        });

        continue;
      }

      seenEmployeeIds.add(employeeId);
      employeeIds.push(employeeId);

      // ----------------------------------------------------------
      // Status validation
      // ----------------------------------------------------------

      if (!allowedStatuses.includes(emp.status)) {
        invalidRequestEmployees.push({
          employeeId,
          missing: [
            `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
          ],
        });

        continue;
      }

      // ----------------------------------------------------------
      // Present employees require shift + location
      // ----------------------------------------------------------

      if (emp.status === "present") {
        if (!allowedShifts.includes(emp.shift)) {
          invalidRequestEmployees.push({
            employeeId,
            missing: [
              `Invalid shift. Allowed values: ${allowedShifts.join(", ")}`,
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

      // ----------------------------------------------------------
      // Absent / leave must not have shift or location
      // ----------------------------------------------------------

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
      return res.status(400).json({
        success: false,
        message: "Invalid attendance data.",
        employees: invalidRequestEmployees,
      });
    }

    // ============================================================
    // 5. COLLECT LOCATION IDS
    // ============================================================

    const locationIds = [
      ...new Set(
        employees
          .filter((emp) => emp.status === "present" && emp.locationId)
          .map((emp) => emp.locationId.toString()),
      ),
    ];

    // ============================================================
    // 6. LOAD ACTIVE EMPLOYEES
    // ============================================================

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

    // ============================================================
    // 7. LOAD LOCATIONS
    // ============================================================

    const locationDocs = await Location.find({
      _id: { $in: locationIds },
    })
      .select("name sector isActive")
      .populate({
        path: "sector",
        select: "_id name",
      });

    // ============================================================
    // 8. CREATE LOOKUP MAPS
    // ============================================================

    const employeeMap = new Map(
      employeeDocs.map((emp) => [emp._id.toString(), emp]),
    );

    const locationMap = new Map(
      locationDocs.map((location) => [location._id.toString(), location]),
    );

    // ============================================================
    // 9. VALIDATE EMPLOYEES + LOCATIONS
    // ============================================================

    const invalidEmployees = [];

    for (const attendance of employees) {
      const employeeId = attendance.employeeId.toString();
      const employee = employeeMap.get(employeeId);

      // ----------------------------------------------------------
      // Employee must exist and be active
      // ----------------------------------------------------------

      if (!employee) {
        invalidEmployees.push({
          employeeId,
          missing: ["Employee not found or inactive"],
        });

        continue;
      }

      // ----------------------------------------------------------
      // Present attendance validation
      // ----------------------------------------------------------

      if (attendance.status === "present") {
        const missingReasons = [];

        // Shift
        if (!attendance.shift) {
          missingReasons.push("Shift");
        }

        // Location
        if (!attendance.locationId) {
          missingReasons.push("Location");
        }

        const location = attendance.locationId
          ? locationMap.get(attendance.locationId.toString())
          : null;

        // Location exists
        if (attendance.locationId && !location) {
          missingReasons.push("Location not found");
        }

        // Location active
        if (location && !location.isActive) {
          missingReasons.push("Location is inactive");
        }

        // --------------------------------------------------------
        // Employee sector / location sector validation
        // --------------------------------------------------------

        if (location && employee.sector) {
          const employeeSectorId = employee.sector.toString();

          const locationSectorId = location.sector?._id?.toString();

          if (locationSectorId && employeeSectorId !== locationSectorId) {
            missingReasons.push(
              "Location does not belong to employee's sector",
            );
          }
        }

        // --------------------------------------------------------
        // Return all validation errors for this employee
        // --------------------------------------------------------

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

    // ============================================================
    // 10. REJECT ENTIRE SUBMISSION IF ANY EMPLOYEE IS INVALID
    // ============================================================

    if (invalidEmployees.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some employees have invalid attendance data.",
        employees: invalidEmployees,
      });
    }

    // ============================================================
    // 11. BUILD ATTENDANCE OPERATIONS
    // ============================================================

    const operations = employees.map((attendance) => {
      const employeeId = attendance.employeeId.toString();

      const employee = employeeMap.get(employeeId);

      const location = attendance.locationId
        ? locationMap.get(attendance.locationId.toString())
        : null;

      const isPresent = attendance.status === "present";

      // ----------------------------------------------------------
      // Location snapshot
      //
      // Present:
      //   Use submitted attendance location.
      //
      // Absent/Leave:
      //   Preserve employee's current assigned location
      //   as historical information.
      // ----------------------------------------------------------

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

      // ----------------------------------------------------------
      // Attendance upsert
      // ----------------------------------------------------------

      return {
        updateOne: {
          filter: {
            employee: employee._id,
            date: attendanceDate,
          },

          update: {
            $set: {
              employee: employee._id,

              // Historical employee information
              employeeSnapshot: {
                empId: employee.empId,
                name: employee.name,
                fatherName: employee.fatherName,
                designation: employee.designation,
              },

              // Today
              date: attendanceDate,

              // present | absent | leave
              status: attendance.status,

              // Only present has a shift
              shift: isPresent ? attendance.shift : null,

              // Only present has an attendance location
              location: isPresent ? location?._id : null,

              // Historical location information
              locationSnapshot,

              // Optional remarks
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

    // ============================================================
    // 12. SAVE ALL ATTENDANCE RECORDS
    // ============================================================

    await Attendance.bulkWrite(operations);

    // ============================================================
    // 13. SUCCESS RESPONSE
    // ============================================================

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      date: attendanceDate,
      totalEmployees: employees.length,
    });
  } catch (error) {
    console.error("submitAttendanceSession error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit attendance.",
    });
  }
};

// ======================================
// GET MONTHLY ATTENDANCE REPORT
// GET /api/attendance/reports/monthly?month=2026-07
// ======================================

const normalizeMonth = (month) => {
  if (!month) {
    throw new Error("Month is required.");
  }

  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (!regex.test(month)) {
    throw new Error("Month format must be YYYY-MM");
  }

  return month;
};

const getMonthDays = (year, month) => {
  const totalDays = new Date(year, month, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => index + 1);
};

const mapAttendanceStatus = (status) => {
  switch (status) {
    case "present":
      return "P";

    case "leave":
      return "L";

    case "absent":
      return "A";

    default:
      return "-";
  }
};

export const getMonthlyAttendanceReport = async (req, res) => {
  try {
    // ======================================
    // VALIDATE MONTH
    // ======================================

    const month = normalizeMonth(req.query.month);

    const [year, monthNumber] = month.split("-").map(Number);

    const totalDays = new Date(year, monthNumber, 0).getDate();

    const monthStart = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

    const monthEnd = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
      totalDays,
    ).padStart(2, "0")}`;

    const days = getMonthDays(year, monthNumber);

    // ======================================
    // GET EMPLOYEES
    // ======================================

    const employees = await Employee.find({
      $or: [
        {
          status: "active",
        },
        {
          status: "inactive",
          exitDate: {
            $gte: new Date(`${monthStart}T00:00:00.000Z`),
          },
        },
      ],
    })
      .select("_id empId name fatherName designation status exitDate")
      .sort({ empId: 1 })
      .lean();

    // ======================================
    // GET MONTHLY ATTENDANCE
    // ======================================

    const attendance = await Attendance.find({
      date: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    })
      .select("employee date status")
      .lean();

    // ======================================
    // OVERALL STATS
    // ======================================

    const overall = {
      employees: employees.length,
      present: 0,
      leave: 0,
      absent: 0,
      total: 0,
    };

    // ======================================
    // EMPLOYEE MAP
    // ======================================

    const employeeMap = new Map();

    for (const employee of employees) {
      const attendanceDays = {};

      for (const day of days) {
        attendanceDays[day] = "-";
      }

      employeeMap.set(employee._id.toString(), {
        employeeId: employee._id,
        empId: employee.empId,
        name: employee.name,
        fatherName: employee.fatherName,
        designation: employee.designation,

        summary: {
          present: 0,
          leave: 0,
          absent: 0,
          total: 0,
        },

        attendance: attendanceDays,
      });
    }

    // ======================================
    // PROCESS ATTENDANCE
    // ======================================

    for (const record of attendance) {
      if (!record.date || !record.employee) continue;

      const [recordYear, recordMonth, recordDay] = record.date
        .split("-")
        .map(Number);

      // Defensive validation
      if (
        recordYear !== year ||
        recordMonth !== monthNumber ||
        recordDay < 1 ||
        recordDay > totalDays
      ) {
        continue;
      }

      const employee = employeeMap.get(record.employee.toString());

      if (!employee) continue;

      const status = mapAttendanceStatus(record.status);

      employee.attendance[recordDay] = status;

      switch (status) {
        case "P":
          employee.summary.present++;
          employee.summary.total++;

          overall.present++;
          overall.total++;

          break;

        case "L":
          employee.summary.leave++;
          employee.summary.total++;

          overall.leave++;
          overall.total++;

          break;

        case "A":
          employee.summary.absent++;

          overall.absent++;

          break;

        default:
          break;
      }
    }

    // ======================================
    // CONVERT MAP TO ARRAY
    // ======================================

    const report = Array.from(employeeMap.values());

    // ======================================
    // SORT BY EMPLOYEE NUMBER
    // ======================================

    const getEmployeeNumber = (empId) => {
      const match = empId?.match(/(\d+)$/);

      return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
    };

    report.sort(
      (a, b) => getEmployeeNumber(a.empId) - getEmployeeNumber(b.empId),
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Monthly attendance report fetched successfully",
      data: {
        month: {
          value: month,
          year,
          month: monthNumber,
          days: totalDays,
        },
        overall,
        employees: report,
      },
    });
  } catch (error) {
    console.error("Monthly attendance report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly attendance report",
    });
  }
};

// Update currentLocation in Attendance Session
export const updateEmployeeLocations = async (req, res) => {
  try {
    const { employees } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Employees data is required",
      });
    }

    // ==========================================
    // LOAD EMPLOYEES
    // ==========================================

    const employeeIds = employees.map((emp) => emp.employeeId);

    const employeeDocs = await Employee.find({
      _id: { $in: employeeIds },
      status: "active",
    })
      .select("currentLocation")
      .lean();

    const employeeMap = new Map(
      employeeDocs.map((emp) => [emp._id.toString(), emp]),
    );

    // ==========================================
    // LOAD LOCATIONS
    // ==========================================

    const locationIds = [
      ...new Set(employees.map((emp) => emp.locationId).filter(Boolean)),
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

    // ==========================================
    // VALIDATE + BUILD OPERATIONS
    // ==========================================

    const invalidEmployees = [];

    const operations = [];

    for (const item of employees) {
      const employee = employeeMap.get(item.employeeId);

      if (!employee) {
        invalidEmployees.push({
          employeeId: item.employeeId,
          missing: ["Employee not found"],
        });
        continue;
      }

      const location = locationMap.get(item.locationId);

      if (!location) {
        invalidEmployees.push({
          employeeId: item.employeeId,
          missing: ["Location not found or inactive"],
        });
        continue;
      }

      const currentLocation = employee.currentLocation?.toString();

      if (currentLocation === item.locationId) {
        continue;
      }

      operations.push({
        updateOne: {
          filter: {
            _id: item.employeeId,
          },
          update: {
            $set: {
              currentLocation: item.locationId,
            },
          },
        },
      });
    }

    // ==========================================
    // RETURN VALIDATION ERRORS
    // ==========================================

    if (invalidEmployees.length) {
      return res.status(400).json({
        success: false,
        message: "Some employees have invalid locations.",
        employees: invalidEmployees,
      });
    }

    // ==========================================
    // UPDATE EMPLOYEES
    // ==========================================

    if (operations.length) {
      await Employee.bulkWrite(operations);
    }

    // ==========================================
    // RETURN UPDATED SESSION
    // ==========================================

    const session = await buildAttendanceSession();

    return res.status(200).json({
      success: true,
      message: "Employee locations updated successfully.",
      ...session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update defaultShit in Attendance Session
export const updateEmployeeShifts = async (req, res) => {
  try {
    const { employees } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Employees data is required",
      });
    }

    // ==========================================
    // VALIDATE SHIFT VALUES
    // ==========================================

    const validShifts = ["day", "night"];

    const invalidEmployees = [];

    for (const item of employees) {
      if (!item.employeeId) {
        invalidEmployees.push({
          employeeId: item.employeeId ?? null,
          missing: ["Employee ID is required"],
        });

        continue;
      }

      if (!validShifts.includes(item.shift)) {
        invalidEmployees.push({
          employeeId: item.employeeId,
          missing: ["Shift must be either day or night"],
        });
      }
    }

    // ==========================================
    // RETURN VALIDATION ERRORS
    // ==========================================

    if (invalidEmployees.length) {
      return res.status(400).json({
        success: false,
        message: "Some employees have invalid shifts.",
        employees: invalidEmployees,
      });
    }

    // ==========================================
    // LOAD EMPLOYEES
    // ==========================================

    const employeeIds = employees.map((emp) => emp.employeeId);

    const employeeDocs = await Employee.find({
      _id: { $in: employeeIds },
      status: "active",
    })
      .select("defaultShift")
      .lean();

    const employeeMap = new Map(
      employeeDocs.map((emp) => [emp._id.toString(), emp]),
    );

    // ==========================================
    // VALIDATE EMPLOYEES
    // ==========================================

    for (const item of employees) {
      const employee = employeeMap.get(item.employeeId);

      if (!employee) {
        invalidEmployees.push({
          employeeId: item.employeeId,
          missing: ["Employee not found or inactive"],
        });
      }
    }

    // ==========================================
    // RETURN EMPLOYEE VALIDATION ERRORS
    // ==========================================

    if (invalidEmployees.length) {
      return res.status(400).json({
        success: false,
        message: "Some employees are invalid.",
        employees: invalidEmployees,
      });
    }

    // ==========================================
    // BUILD OPERATIONS
    // ==========================================

    const operations = [];

    for (const item of employees) {
      const employee = employeeMap.get(item.employeeId);

      const defaultShift = employee.defaultShift;

      // No change required
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

    // ==========================================
    // UPDATE EMPLOYEES
    // ==========================================

    if (operations.length) {
      await Employee.bulkWrite(operations);
    }

    // ==========================================
    // RETURN UPDATED SESSION
    // ==========================================

    const session = await buildAttendanceSession();

    return res.status(200).json({
      success: true,
      message: "Employee shifts updated successfully.",
      ...session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
