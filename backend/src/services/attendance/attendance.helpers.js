import ApiError from "../../utils/ApiError.js";

// Normalize date to YYYY-MM-DD
export const normalizeDate = (date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  return parsed.toISOString().split("T")[0];
};

// Convert sector value to a string ID for snapshots
export const toSnapshotSectorId = (sector) => {
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

// Get all days in a month
export const getMonthDays = (year, month) => {
  const totalDays = new Date(year, month, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => index + 1);
};

// Convert attendance status to report symbol
export const mapAttendanceStatus = (status) => {
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
