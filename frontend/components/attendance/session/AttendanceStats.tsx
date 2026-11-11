"use client";

import {
  Users,
  CheckCircle2,
  XCircle,
  CalendarClock,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { StatCard, type StatTone } from "@/components/ui/StatCard";

interface AttendanceStatsProps {
  total: number;
  present: number;
  absent: number;
  leave: number;
}

export default function AttendanceStats({
  total,
  present,
  absent,
  leave,
}: AttendanceStatsProps) {
  const presentPercentage =
    total === 0 ? 0 : Math.round((present / total) * 100);

  const cards: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
    tone: StatTone;
  }[] = [
    {
      title: "Total Employees",
      value: total,
      subtitle: "Active workforce",
      icon: Users,
      tone: "blue",
    },
    {
      title: "Present",
      value: present,
      subtitle: `${presentPercentage}% Attendance`,
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      title: "Absent",
      value: absent,
      subtitle: "Not Reported",
      icon: XCircle,
      tone: "red",
    },
    {
      title: "Leave",
      value: leave,
      subtitle: "Approved Leave",
      icon: CalendarClock,
      tone: "amber",
    },
  ];

  return (
    <section className="space-y-3">
      {/* Top Summary */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">
            Attendance Overview
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Live summary of today&apos;s attendance session.
          </p>
        </div>

        <Badge tone="success" className="hidden gap-1.5 md:inline-flex">
          <TrendingUp className="size-3.5" />
          <span className="tabular-nums">{presentPercentage}%</span>
          Present
        </Badge>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.title}
            label={card.title}
            value={card.value}
            icon={card.icon}
            tone={card.tone}
            hint={
              card.title === "Present" ? (
                <span className="block space-y-1.5">
                  <span className="block">{card.subtitle}</span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${presentPercentage}%`,
                      }}
                    />
                  </span>
                </span>
              ) : (
                card.subtitle
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
