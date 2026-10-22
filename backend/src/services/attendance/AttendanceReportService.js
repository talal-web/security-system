import mongoose from "mongoose";

import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import ApiError from "../../utils/ApiError.js";

import { normalizeDate } from "./attendance.helpers.js";

import {
  validateAttendanceStatus,
  validateAttendanceShift,
} from "./attendance.validation.js";

// enforceAreaScope has already validated exactly one area.
// areaScope.areaId is the single source of truth. query.area is ignored.
const getScopedAreaId = (areaScope = {}) => {
  const areaId = areaScope?.areaId;

  if (typeof areaId !== "string" || !areaId.trim()) {
    throw new ApiError(400, "Area selection is required");
  }

  if (!mongoose.Types.ObjectId.isValid(areaId)) {
    throw new ApiError(400, "Invalid area ID");
  }

  return areaId;
};

// ======================================
// Get Attendance Report
// ======================================

export const getAttendanceReportService = async ({
  query = {},
  areaScope = {},
}) => {
  const { status, shift, date } = query;

  const areaId = getScopedAreaId(areaScope);

  const match = {};

  // ======================================
  // Validate Filters
  // ======================================

  if (status) {
    validateAttendanceStatus(status);
    match.status = status;
  }

  if (shift) {
    validateAttendanceShift(shift);
    match.shift = shift;
  }

  if (date !== undefined && date !== "" && typeof date !== "string") {
    throw new ApiError(400, "Invalid date");
  }

  const reportDate = date ? normalizeDate(date) : normalizeDate(new Date());

  if (!reportDate || Number.isNaN(new Date(reportDate).getTime())) {
    throw new ApiError(400, "Invalid date");
  }

  match.date = reportDate;

  // Legacy records without an area use the employee's current area.

  const employeesInScope = await Employee.find({ area: areaId })
    .select("_id")
    .lean();

  const employeeIds = employeesInScope.map((employee) => employee._id);
  const areaConditions = [{ area: new mongoose.Types.ObjectId(areaId) }];

  if (employeeIds.length) {
    areaConditions.push({
      area: null,
      employee: { $in: employeeIds },
    });
  }

  match.$or = areaConditions;

  // ======================================
  // Aggregate Attendance Report
  // ======================================

  const data = await Attendance.aggregate([
    { $match: match },

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

    // ======================================
    // Report Sections
    // ======================================

    {
      $facet: {
        // ----------------------------------
        // Global Stats
        // ----------------------------------

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

        // ----------------------------------
        // Present Employees by Sector
        // ----------------------------------

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
          {
            $sort: {
              sector: 1,
              sortOrder: 1,
            },
          },
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

        // ----------------------------------
        // Absent Employees
        // ----------------------------------

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

        // ----------------------------------
        // Leave Employees
        // ----------------------------------

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

  // ======================================
  // Format Response
  // ======================================

  const report = data[0] ?? {};

  return {
    success: true,
    message: "Attendance report fetched successfully",
    data: {
      globalStats: report.globalStats?.[0] ?? {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        day: 0,
        night: 0,
      },

      presentSectors: report.presentSectors ?? [],

      absentEmployees: report.absentEmployees ?? [],

      leaveEmployees: report.leaveEmployees ?? [],
    },
  };
};
