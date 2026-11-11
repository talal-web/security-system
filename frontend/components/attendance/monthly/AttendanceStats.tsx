import {
  Briefcase,
  CalendarMinus,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import type { MonthlyAttendanceOverall } from "@/types/attendance";

interface MonthlyAttendanceStatsProps {
  overall: MonthlyAttendanceOverall;
}

const stats = [
  {
    key: "employees",
    label: "Employees",
    icon: Briefcase,
    tone: "blue",
  },
  {
    key: "absent",
    label: "Absent",
    icon: UserX,
    tone: "red",
  },
  {
    key: "present",
    label: "Present",
    icon: UserCheck,
    tone: "emerald",
  },
  {
    key: "leave",
    label: "Leave",
    icon: CalendarMinus,
    tone: "amber",
  },
  {
    key: "total",
    label: "Attendance",
    icon: Users,
    tone: "violet",
  },
] as const;

export default function MonthlyAttendanceStats({
  overall,
}: MonthlyAttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          label={stat.label}
          value={overall[stat.key]}
          icon={stat.icon}
          tone={stat.tone}
        />
      ))}
    </div>
  );
}
