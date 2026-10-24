import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";
import { STATUS_SOFT_PILL_CLASSES, type StatusTone } from "@/utils/ui/statusColors";

const STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: "success",
  absent: "danger",
  leave: "warning",
};

export function getStatusStyle(status: AttendanceStatus) {
  const tone = STATUS_TONE[status] ?? "neutral";

  return `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_SOFT_PILL_CLASSES[tone]}`;
}

export function getShiftStyle(shift?: AttendanceShift | null) {
  if (!shift) {
    return "inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200";
  }

  return shift === "day"
    ? "inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
    : "inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-200";
}
