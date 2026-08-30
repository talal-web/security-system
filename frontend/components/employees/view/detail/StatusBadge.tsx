import { Circle } from "lucide-react";
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      } ${className}`}
    >
      <Circle
        className={`h-2.5 w-2.5 fill-current ${
          isActive ? "text-emerald-400" : "text-red-400"
        }`}
      />

      <span>{formatText(status)}</span>
    </div>
  );
}
