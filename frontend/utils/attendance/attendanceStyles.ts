import type { AttendanceShift, AttendanceStatus } from "@/types/attendance";
import type { StatusTone } from "@/utils/ui/statusColors";

const STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: "success",
  absent: "danger",
  leave: "warning",
};

const BADGE_BASE =
  "inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

const STATUS_BADGE_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/15",
};

export function getStatusStyle(status: AttendanceStatus) {
  const tone = STATUS_TONE[status] ?? "neutral";

  return `${BADGE_BASE} ${STATUS_BADGE_CLASSES[tone]}`;
}

export function getShiftStyle(shift?: AttendanceShift | null) {
  if (!shift) {
    return `${BADGE_BASE} bg-slate-100 text-slate-700 ring-slate-500/15`;
  }

  return shift === "day"
    ? `${BADGE_BASE} bg-amber-50 text-amber-700 ring-amber-600/20`
    : `${BADGE_BASE} bg-indigo-50 text-indigo-700 ring-indigo-600/20`;
}
