"use client";

import {
  CalendarClock,
  CheckCircle2,
  Moon,
  Sun,
  Users,
  XCircle,
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import type { AttendanceGlobalStats } from "@/types/attendance";

interface AttendanceStatsProps {
  stats: AttendanceGlobalStats;
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total" value={stats.total} icon={Users} tone="slate" />

      <StatCard
        label="Present"
        value={stats.present}
        icon={CheckCircle2}
        tone="emerald"
      />

      <StatCard
        label="Absent"
        value={stats.absent}
        icon={XCircle}
        tone="red"
      />

      <StatCard
        label="Leave"
        value={stats.leave}
        icon={CalendarClock}
        tone="amber"
      />

      <StatCard label="Day Shift" value={stats.day} icon={Sun} tone="blue" />

      <StatCard
        label="Night Shift"
        value={stats.night}
        icon={Moon}
        tone="violet"
      />
    </div>
  );
}
