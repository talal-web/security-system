"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

const modules = [
  {
    title: "Mark Attendance",
    description: "Start and manage today\'s session.",
    href: "/attendance/session",
    icon: ClipboardCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    border: "group-hover:border-blue-300",
  },
  {
    title: "Daily Attendance",
    description: "Check records and daily report.",
    href: "/attendance/daily",
    icon: CalendarDays,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    border: "group-hover:border-emerald-300",
  },
  {
    title: "Monthly Report",
    description: "View monthly summary and export.",
    href: "/attendance/monthly",
    icon: BarChart3,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    border: "group-hover:border-violet-300",
  },
];

export default function AttendanceDashboardPage() {
  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 sm:text-sm">
                <ShieldCheck className="h-4 w-4" />
                Attendance
              </span>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="text-sm text-slate-600">
                Manage sessions and reports.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Today</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-700">Status</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700 sm:text-base">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${module.border}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${module.iconColor}`} />
                    </div>

                    <ArrowRight className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
                  </div>

                  <div className="mt-5">
                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                      {module.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {module.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
