import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Location from "../models/Location.js";

// POST /api/attendance
const normalizeDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format");
  }
  return parsed.toISOString().split("T")[0];
};

// GET /api/attendance
export const getAttendanceReport = async (req, res) => {
  try {
    const { status, shift, date } = req.query;

    const match = {};

    if (status) match.status = status;
    if (shift) match.shift = shift;

    if (date) {
      match.date = normalizeDate(date);
    } else {
      match.date = normalizeDate(new Date());
    }

    const data = await Attendance.aggregate([
      { $match: match },

      // JOIN LOCATION
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
                "locationSnapshot.sector": 1,
                "location.sortOrder": 1,
                "employeeSnapshot.empId": 1,
              },
            },

            {
              $group: {
                _id: {
                  sector: "$locationSnapshot.sector",
                  locationId: "$locationSnapshot.locationId",
                },

                sector: {
                  $first: "$locationSnapshot.sector",
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

            {
              $sort: {
                sector: 1,
                sortOrder: 1,
              },
            },

            {
              $group: {
                _id: "$sector",

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

            {
              $project: {
                _id: 0,
                sector: "$_id",
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

                sector: "$locationSnapshot.sector",
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

                sector: "$locationSnapshot.sector",
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

    return res.status(200).json({
      success: true,
      message: "Attendance report fetched successfully",
      data: {
        globalStats: data[0].globalStats[0] || {
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
          day: 0,
          night: 0,
        },

        presentSectors: data[0].presentSectors,

        absentEmployees: data[0].absentEmployees,

        leaveEmployees: data[0].leaveEmployees,
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
    const attendanceDate = normalizeDate(new Date());

    const attendanceExists = await Attendance.exists({
      date: attendanceDate,
    });

    // ==========================================
    // GET ACTIVE LOCATIONS
    // ==========================================
    const locations = await Location.find({
      isActive: true,
    })
      .select("name sector sortOrder isActive")
      .sort({
        sector: 1,
        sortOrder: 1,
        name: 1,
      })
      .lean();

    // ==========================================
    // GET ACTIVE EMPLOYEES
    // ==========================================
    const employees = await Employee.find({
      status: "active",
    })
      .select(
        "empId name fatherName designation sector defaultShift currentLocation",
      )
      .lean();

    // ==========================================
    // LOCATION MAP
    // ==========================================
    const locationMap = new Map();

    for (const location of locations) {
      locationMap.set(location._id.toString(), {
        _id: location._id,
        name: location.name,
        sortOrder: location.sortOrder,
        isActive: Boolean(location.isActive),
        employeeCount: 0,
        employees: [],
      });
    }

    // ==========================================
    // ATTACH EMPLOYEES TO LOCATIONS
    // ==========================================
    for (const employee of employees) {
      if (!employee.currentLocation) continue;

      const location = locationMap.get(employee.currentLocation.toString());

      if (!location) continue;

      location.employees.push({
        employeeId: employee._id,

        empId: employee.empId,
        name: employee.name,
        fatherName: employee.fatherName,
        designation: employee.designation,

        defaultShift: employee.defaultShift,
      });

      location.employeeCount++;
    }

    // ==========================================
    // GROUP LOCATIONS BY SECTOR
    // ==========================================
    const sectorMap = new Map();

    for (const location of locations) {
      const sector = location.sector || "Unassigned";

      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, {
          sector,
          totalLocations: 0,
          totalEmployees: 0,
          locations: [],
        });
      }

      const sectorData = sectorMap.get(sector);

      const locationData = locationMap.get(location._id.toString());

      sectorData.locations.push(locationData);

      sectorData.totalLocations++;

      sectorData.totalEmployees += locationData.employeeCount;
    }

    // ==========================================
    // FINAL SECTORS
    // ==========================================
    const sectors = Array.from(sectorMap.values()).sort((a, b) =>
      a.sector.localeCompare(b.sector),
    );

    // ==========================================
    // RESPONSE
    // ==========================================
    return res.status(200).json({
      success: true,

      attendanceDate,

      alreadyMarked: Boolean(attendanceExists),

      stats: {
        totalEmployees: employees.length,
        totalLocations: locations.length,
        totalSectors: sectors.length,
      },

      sectors,
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

    const attendanceDate = normalizeDate(date);

    const employeeIds = employees.map((emp) => emp.employeeId);
    const locationIds = employees
      .filter((emp) => emp.status === "present" && emp.locationId)
      .map((emp) => emp.locationId);

    const employeeDocs = await Employee.find({
      _id: { $in: employeeIds },
      status: "active",
    })
      .select(
        "empId name fatherName designation defaultShift sector currentLocation",
      )
      .populate("currentLocation", "name sector isActive");

    const locationDocs = await Location.find({
      _id: { $in: locationIds },
    }).select("name sector isActive");

    const employeeMap = new Map(
      employeeDocs.map((emp) => [emp._id.toString(), emp]),
    );
    const locationMap = new Map(
      locationDocs.map((loc) => [loc._id.toString(), loc]),
    );

    const invalidEmployees = [];

    for (const emp of employees) {
      const employee = employeeMap.get(emp.employeeId);

      if (!employee) {
        invalidEmployees.push({
          employeeId: emp.employeeId,
          missing: ["Employee not found"],
        });
        continue;
      }

      if (emp.status === "present") {
        const missingReasons = [];

        if (!emp.shift) {
          missingReasons.push("Shift");
        }

        if (!emp.locationId) {
          missingReasons.push("Location");
        }

        const location = emp.locationId
          ? locationMap.get(emp.locationId)
          : null;

        if (emp.locationId && !location) {
          missingReasons.push("Location not found");
        }

        if (location && !location.isActive) {
          missingReasons.push("Location is inactive");
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

    if (invalidEmployees.length) {
      return res.status(400).json({
        success: false,
        message: "Some employees have invalid attendance data.",
        employees: invalidEmployees,
      });
    }

    const operations = employees.map((attendance) => {
      const employee = employeeMap.get(attendance.employeeId);
      const location = attendance.locationId
        ? locationMap.get(attendance.locationId)
        : null;
      const isPresent = attendance.status === "present";

      const locationSnapshot =
        isPresent && location
          ? {
              locationId: location._id,
              name: location.name,
              sector: location.sector,
            }
          : employee.currentLocation
            ? {
                locationId: employee.currentLocation._id,
                name: employee.currentLocation.name,
                sector: employee.currentLocation.sector,
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

              remarks: attendance.remarks || "",
            },
          },
          upsert: true,
        },
      };
    });

    await Attendance.bulkWrite(operations);

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      totalEmployees: employees.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
