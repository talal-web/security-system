import type { AttendanceStatus } from "@/types/attendance";
import { STATUS_PILL_CLASSES, type StatusTone } from "@/utils/ui/statusColors";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

const STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: "success",
  absent: "danger",
  leave: "warning",
};

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    className: string;
  }
> = {
  present: {
    label: "Present",
    className: `border ${STATUS_PILL_CLASSES[STATUS_TONE.present]}`,
  },
  absent: {
    label: "Absent",
    className: `border ${STATUS_PILL_CLASSES[STATUS_TONE.absent]}`,
  },
  leave: {
    label: "Leave",
    className: `border ${STATUS_PILL_CLASSES[STATUS_TONE.leave]}`,
  },
};

export default function AttendanceStatusBadge({
  status,
}: AttendanceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
