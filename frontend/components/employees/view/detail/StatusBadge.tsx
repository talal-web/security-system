import { Circle } from "lucide-react";
import { formatText } from "@/utils/employee/employeeFormat";
import {
  STATUS_DOT_CLASSES,
  STATUS_PILL_CLASSES,
  type StatusTone,
} from "@/utils/ui/statusColors";

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
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${STATUS_PILL_CLASSES[tone]} ${className}`}
    >
      <Circle className={`h-2.5 w-2.5 fill-current ${STATUS_DOT_CLASSES[tone]}`} />

      <span>{formatText(status)}</span>
    </div>
  );
}
