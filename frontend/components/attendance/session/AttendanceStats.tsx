"use client";

import {
  Users,
  CheckCircle2,
  XCircle,
  CalendarClock,
  TrendingUp,
} from "lucide-react";

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

  const cards = [
    {
      title: "Total Employees",
      value: total,
      subtitle: "Active workforce",
      icon: Users,
      bg: "from-blue-50 to-white",
      iconBg: "bg-blue-600",
      text: "text-blue-700",
    },
    {
      title: "Present",
      value: present,
      subtitle: `${presentPercentage}% Attendance`,
      icon: CheckCircle2,
      bg: "from-green-50 to-white",
      iconBg: "bg-green-600",
      text: "text-green-700",
    },
    {
      title: "Absent",
      value: absent,
      subtitle: "Not Reported",
      icon: XCircle,
      bg: "from-red-50 to-white",
      iconBg: "bg-red-600",
      text: "text-red-700",
    },
    {
      title: "Leave",
      value: leave,
      subtitle: "Approved Leave",
      icon: CalendarClock,
      bg: "from-amber-50 to-white",
      iconBg: "bg-amber-500",
      text: "text-amber-700",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Summary */}
      <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live summary of today's attendance session.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-xl bg-green-100 px-4 py-2 md:flex">
          <TrendingUp className="h-5 w-5 text-green-700" />

          <span className="text-lg font-bold text-green-700">
            {presentPercentage}%
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`group rounded-2xl border bg-gradient-to-br ${card.bg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {card.title}
                  </p>

                  <h3 className={`mt-2 text-4xl font-bold ${card.text}`}>
                    {card.value}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">{card.subtitle}</p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              {/* Progress Bar */}
              {card.title === "Present" && (
                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                      style={{
                        width: `${presentPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
