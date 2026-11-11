import { Badge } from "@/components/ui/Badge";
import type { AttendanceStatus } from "@/types/attendance";
import type { StatusTone } from "@/utils/ui/statusColors";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

const STATUS_TONE: Record<AttendanceStatus, StatusTone> = {
  present: "success",
  absent: "danger",
  leave: "warning",
};

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  leave: "Leave",
};

export default function AttendanceStatusBadge({
  status,
}: AttendanceStatusBadgeProps) {
  return (
    <Badge tone={STATUS_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
