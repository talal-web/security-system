import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Location from "../models/Location.js";

// POST /api/attendance

export const createAttendance = async (req, res) => {
  try {
    const { employeeId, locationId, date, shift, status, remarks } = req.body;

    const attendance = await Attendance.create({
      employee: employeeId,
      location: locationId,
      date,
      shift,
      status,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/attendance
export const getAttendances = async (req, res) => {
  try {
    const { status, shift, date } = req.query;

    const match = {};

    if (status) match.status = status;
    if (shift) match.shift = shift;

    let start, end;

    if (date) {
      start = new Date(date);
      end = new Date(date);
      end.setDate(end.getDate() + 1);
    } else {
      const today = new Date();
      start = new Date(today);
      start.setHours(0, 0, 0, 0);

      end = new Date(today);
      end.setHours(23, 59, 59, 999);
    }

    match.date = { $gte: start, $lte: end };

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
      { $unwind: "$location" },

      // JOIN EMPLOYEE
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },

      // ================= GLOBAL STATS (ALL DATA) =================
      {
        $facet: {
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
                          { $eq: ["$shift", "day"] },
                          { $eq: ["$status", "present"] },
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
                          { $eq: ["$shift", "night"] },
                          { $eq: ["$status", "present"] },
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

          // ================= SECTOR WISE =================
          sectors: [
            {
              $group: {
                _id: "$location.sector",

                total: { $sum: 1 },

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
                    $cond: [{ $eq: ["$shift", "day"] }, 1, 0],
                  },
                },

                night: {
                  $sum: {
                    $cond: [{ $eq: ["$shift", "night"] }, 1, 0],
                  },
                },

                records: {
                  $push: {
                    _id: "$_id",
                    empId: "$employee.empId",
                    name: "$employee.name",
                    fatherName: "$employee.fatherName",
                    location: "$location.name",
                    sector: "$location.sector",
                    shift: "$shift",
                    status: "$status",
                    date: "$date",
                  },
                },
              },
            },

            {
              $project: {
                _id: 0,
                sector: "$_id",
                total: 1,
                present: 1,
                absent: 1,
                leave: 1,
                day: 1,
                night: 1,
                records: 1,
              },
            },

            { $sort: { sector: 1 } },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Attendance stats fetched successfully",
      data: {
        globalStats: data[0].globalStats[0] || {
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
          day: 0,
          night: 0,
        },
        sectors: data[0].sectors,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET /api/attendance/:id

export const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("employee", "empId name designation")
      .populate("location", "name")
      .lean();

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/attendance/:id

export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("employee", "empId name designation")
      .populate("location", "name");

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/attendance/:id

export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark All Employee
export const markBulkAttendance = async (req, res) => {
  try {
    const { date, shift, locationId, employees } = req.body;

    const operations = employees.map((emp) => ({
      updateOne: {
        filter: {
          employee: emp.employeeId,
          date,
          shift,
        },
        update: {
          employee: emp.employeeId,
          location: locationId,
          date,
          shift,
          status: emp.status,
          remarks: emp.remarks || "",
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
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
    const employees = await Employee.find({
      status: "active",
    })
      .select("name fatherName sector currentLocation designation empId status")
      .populate("currentLocation", "name sector")
      .sort({ name: 1 });

    const locations = await Location.find({
      isActive: true,
    })
      .select("name sector")
      .sort({ sector: 1, name: 1 });

    const attendanceEmployees = employees.map((emp) => ({
      employeeId: emp._id,
      empId: emp.empId,
      name: emp.name,
      fatherName: emp.fatherName,
      designation: emp.designation,
      sector: emp.sector,

      currentLocation: emp.currentLocation
        ? {
            _id: emp.currentLocation._id,
            name: emp.currentLocation.name,
            sector: emp.currentLocation.sector,
          }
        : null,

      // default values for UI
      selectedLocation: emp.currentLocation?._id?.toString() || null,
      status: "present",
      shift: "day",
      remarks: "",
    }));

    return res.status(200).json({
      success: true,
      employees: attendanceEmployees,
      locations,
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
export const markAttendanceSession = async (req, res) => {
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

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const operations = employees.map((emp) => ({
      updateOne: {
        filter: {
          employee: emp.employeeId,
          date: attendanceDate,
          shift: emp.shift,
        },
        update: {
          employee: emp.employeeId,
          location: emp.locationId,
          date: attendanceDate,
          shift: emp.shift,
          status: emp.status,
          remarks: emp.remarks || "",
        },
        upsert: true,
      },
    }));

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
