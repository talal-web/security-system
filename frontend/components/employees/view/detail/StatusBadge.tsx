import { formatText } from "@/utils/employee/employeeFormat";
import { Badge } from "@/components/ui/Badge";
import type { StatusTone } from "@/utils/ui/statusColors";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const isActive = status === "active";
  const tone: StatusTone = isActive ? "success" : "danger";

  return (
    <Badge tone={tone} dot className={`py-1 ${className}`}>
      {formatText(status)}
    </Badge>
  );
}
