import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Location from "../models/Location.js";

import { normalizeDate } from "../utils/normalize.js";

const UNASSIGNED_SECTOR = {
  _id: null,
  name: "Unassigned",
  code: "UNASSIGNED",
};

export const buildAttendanceSession = async () => {
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
    .populate({
      path: "sector",
      select: "name code sortOrder",
    })
    .sort({
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
    .select("empId name fatherName designation defaultShift currentLocation")
    .lean();

  // ==========================================
  // CREATE LOCATION MAP
  // ==========================================
  const locationMap = new Map();

  for (const location of locations) {
    locationMap.set(location._id.toString(), {
      _id: location._id,

      name: location.name,

      sector: location.sector || UNASSIGNED_SECTOR,

      sortOrder: location.sortOrder,

      isActive: Boolean(location.isActive),

      employeeCount: 0,

      employees: [],
    });
  }

  // ==========================================
  // ASSIGN EMPLOYEES TO LOCATIONS
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
    const locationData = locationMap.get(location._id.toString());

    const sector = locationData.sector || UNASSIGNED_SECTOR;

    const sectorKey = sector._id ? sector._id.toString() : "unassigned";

    if (!sectorMap.has(sectorKey)) {
      sectorMap.set(sectorKey, {
        sector,

        totalLocations: 0,

        totalEmployees: 0,

        locations: [],
      });
    }

    const sectorData = sectorMap.get(sectorKey);

    sectorData.locations.push(locationData);

    sectorData.totalLocations++;

    sectorData.totalEmployees += locationData.employeeCount;
  }

  // ==========================================
  // FINAL SECTORS
  // ==========================================
  const sectors = Array.from(sectorMap.values()).sort((a, b) => {
    return (
      a.sector.sortOrder - b.sector.sortOrder ||
      a.sector.name.localeCompare(b.sector.name)
    );
  });

  // ==========================================
  // RESPONSE
  // ==========================================
  return {
    attendanceDate,

    alreadyMarked: Boolean(attendanceExists),

    stats: {
      totalEmployees: employees.length,

      totalLocations: locations.length,

      totalSectors: sectors.length,
    },

    sectors,
  };
};
