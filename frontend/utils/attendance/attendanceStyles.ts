import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";

export function getStatusStyle(status: AttendanceStatus) {
  switch (status) {
    case "present":
      return "inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700";

    case "absent":
      return "inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700";

    case "leave":
      return "inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700";

    default:
      return "inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700";
  }
}

export function getShiftStyle(shift?: AttendanceShift | null) {
  if (!shift) {
    return "inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200";
  }

  return shift === "day"
    ? "inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
    : "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-200";
}
