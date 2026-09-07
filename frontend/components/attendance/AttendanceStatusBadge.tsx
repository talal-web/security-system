import type { AttendanceStatus } from "@/types/attendance";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    className: string;
  }
> = {
  present: {
    label: "Present",
    className: "border border-green-200 bg-green-50 text-green-700",
  },
  absent: {
    label: "Absent",
    className: "border border-red-200 bg-red-50 text-red-700",
  },
  leave: {
    label: "Leave",
    className: "border border-amber-200 bg-amber-50 text-amber-700",
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
