import { BadgeCheck, Circle } from "lucide-react";
import { formatText } from "@/utils/employee/employeeFormat";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const isActive = status === "active";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 sm:px-4 sm:text-sm ${
        isActive
          ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-300"
          : "border-red-400/20 bg-red-500/15 text-red-300"
      } ${className}`}
    >
      <Circle
        className={`h-2.5 w-2.5 fill-current ${
          isActive ? "text-emerald-400" : "text-red-400"
        }`}
      />

      <BadgeCheck className="h-4 w-4" />

      <span>{formatText(status)}</span>
    </div>
  );
}
