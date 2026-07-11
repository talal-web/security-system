import {
  Briefcase,
  CalendarMinus,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import type { MonthlyAttendanceOverall } from "@/types/attendance";

interface MonthlyAttendanceStatsProps {
  overall: MonthlyAttendanceOverall;
}

const stats = [
  {
    key: "employees",
    label: "Employees",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "absent",
    label: "Absent",
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    key: "present",
    label: "Present",
    icon: UserCheck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "leave",
    label: "Leave",
    icon: CalendarMinus,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "total",
    label: "Attendance",
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
] as const;

export default function MonthlyAttendanceStats({
  overall,
}: MonthlyAttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {overall[stat.key]}
                </p>
              </div>

              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
