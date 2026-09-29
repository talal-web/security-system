import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";

import { normalizeDate } from "./attendance.helpers.js";

import {
  validateAttendanceStatus,
  validateAttendanceShift,
} from "./attendance.validation.js";

// ======================================
// Get Attendance Report
// ======================================

export const getAttendanceReportService = async ({
  query = {},
  areaScope = {},
}) => {
  const { status, shift, date } = query;
  const match = {};

  if (status) {
    validateAttendanceStatus(status);
    match.status = status;
  }

  if (shift) {
    validateAttendanceShift(shift);
    match.shift = shift;
  }

  match.date = date ? normalizeDate(date) : normalizeDate(new Date());

  const areaIds =
    areaScope.requestedAreaIds ?? areaScope.permittedAreaIds ?? [];

  if (areaIds.length && !areaScope.isAdmin) {
    const employeesInScope = await Employee.find({
      area: { $in: areaIds },
    })
      .select("_id")
      .lean();

    const employeeIds = employeesInScope.map((employee) => employee._id);

    if (!employeeIds.length) {
      return {
        success: true,
        data: {
          globalStats: {
            total: 0,
            present: 0,
            absent: 0,
            leave: 0,
            day: 0,
            night: 0,
          },
          presentSectors: [],
          absentEmployees: [],
          leaveEmployees: [],
        },
      };
    }

    match.employee = { $in: employeeIds };
  }

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
    {
      $facet: {
        globalStats: [
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $cond: [{ $in: ["$status", ["present", "leave"]] }, 1, 0],
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
          { $project: { _id: 0 } },
        ],

        presentSectors: [
          { $match: { status: "present" } },
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
              sectorId: { $first: "$resolvedSectorId" },
              sector: { $first: "$resolvedSectorName" },
              locationId: { $first: "$locationSnapshot.locationId" },
              locationName: { $first: "$locationSnapshot.name" },
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
          { $sort: { sector: 1, sortOrder: 1 } },
          {
            $group: {
              _id: "$sectorId",
              sectorId: { $first: "$sectorId" },
              sector: { $first: "$sector" },
              locations: {
                $push: {
                  _id: "$locationId",
                  name: "$locationName",
                  sortOrder: "$sortOrder",
                  isActive: "$isActive",
                  totalEmployees: { $size: "$records" },
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
          { $sort: { sector: 1 } },
        ],

        absentEmployees: [
          { $match: { status: "absent" } },
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
          { $sort: { empId: 1 } },
        ],

        leaveEmployees: [
          { $match: { status: "leave" } },
          {
            $project: {
              _id: 0,
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
          { $sort: { empId: 1 } },
        ],
      },
    },
  ]);

  const report = data[0];

  return {
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
  };
};
