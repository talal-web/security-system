import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import Location from "../../models/Location.js";
import Sector from "../../models/Sector.js";

import { normalizeDate } from "../../utils/normalize.js";

const UNASSIGNED_SECTOR = {
  _id: null,
  name: "Unassigned",
  code: "UNASSIGNED",
};

// ==========================================
// Resolve Selected Area
// ==========================================

const resolveAreaId = (areaScope = {}) => {
  const areaId = areaScope.areaId;

  if (typeof areaId !== "string" || !/^[a-fA-F0-9]{24}$/.test(areaId.trim())) {
    const error = new Error("Valid selected area is required");
    error.statusCode = 403;
    throw error;
  }

  return areaId.trim();
};

// ==========================================
// Build Attendance Session
// ==========================================

export const buildAttendanceSession = async (areaScope = {}) => {
  const attendanceDate = normalizeDate(new Date());
  const areaId = resolveAreaId(areaScope);

  // Legacy attendance records without an area use the employee's current area.
  const employees = await Employee.find({
    status: "active",
    area: areaId,
  })
    .select(
      "empId name fatherName designation defaultShift currentLocation area",
    )
    .lean();
  const employeeIds = employees.map((employee) => employee._id);

  // ==========================================
  // CHECK EXISTING ATTENDANCE
  // ==========================================

  const attendanceExists = await Attendance.exists({
    date: attendanceDate,
    $or: [
      { area: areaId },
      { area: null, employee: { $in: employeeIds } },
    ],
  });

  // ==========================================
  // GET ACTIVE SECTORS IN SELECTED AREA
  // ==========================================

  const sectors = await Sector.find({
    area: areaId,
    isActive: true,
  })
    .select("_id name code sortOrder")
    .lean();

  const sectorIds = sectors.map((sector) => sector._id);

  if (!sectorIds.length) {
    return {
      attendanceDate,
      alreadyMarked: Boolean(attendanceExists),
      stats: {
        totalEmployees: 0,
        totalLocations: 0,
        totalSectors: 0,
      },
      sectors: [],
    };
  }

  // ==========================================
  // GET ACTIVE LOCATIONS IN SELECTED AREA
  // ==========================================

  const locations = await Location.find({
    isActive: true,
    sector: { $in: sectorIds },
  })
    .select("name sector sortOrder isActive")
    .populate({
      path: "sector",
      select: "name code sortOrder area",
    })
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean();

  // ==========================================
  // CREATE LOCATION MAP
  // ==========================================

  const locationMap = new Map();

  for (const location of locations) {
    // Defensive consistency check: the populated sector
    // must still belong to the selected area.
    if (!location.sector || location.sector.area?.toString() !== areaId) {
      continue;
    }

    locationMap.set(location._id.toString(), {
      _id: location._id,
      name: location.name,
      sector: location.sector,
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

  for (const location of locationMap.values()) {
    const sector = location.sector || UNASSIGNED_SECTOR;
    const sectorKey = sector._id?.toString() || "unassigned";

    if (!sectorMap.has(sectorKey)) {
      sectorMap.set(sectorKey, {
        sector,
        totalLocations: 0,
        totalEmployees: 0,
        locations: [],
      });
    }

    const sectorData = sectorMap.get(sectorKey);

    sectorData.locations.push(location);
    sectorData.totalLocations++;
    sectorData.totalEmployees += location.employeeCount;
  }

  // ==========================================
  // FINAL SECTORS
  // ==========================================

  const groupedSectors = Array.from(sectorMap.values()).sort(
    (a, b) =>
      (a.sector.sortOrder ?? 999999) - (b.sector.sortOrder ?? 999999) ||
      a.sector.name.localeCompare(b.sector.name),
  );

  // ==========================================
  // RESPONSE
  // ==========================================

  return {
    attendanceDate,
    alreadyMarked: Boolean(attendanceExists),
    stats: {
      totalEmployees: employees.length,
      totalLocations: locationMap.size,
      totalSectors: groupedSectors.length,
    },
    sectors: groupedSectors,
  };
};
