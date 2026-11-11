"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const modules = [
  {
    title: "Mark Attendance",
    description: "Start and manage today\'s session.",
    href: "/attendance/session",
    icon: ClipboardCheck,
    iconTone: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    title: "Daily Attendance",
    description: "Check records and daily report.",
    href: "/attendance/daily",
    icon: CalendarDays,
    iconTone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  {
    title: "Monthly Report",
    description: "View monthly summary and export.",
    href: "/attendance/monthly",
    icon: BarChart3,
    iconTone: "bg-violet-50 text-violet-600 ring-violet-100",
  },
];

export default function AttendanceDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Manage sessions and reports."
        icon={ShieldCheck}
        meta={<Badge tone="info">Attendance</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <StatCard
          label="Today"
          value={
            <span className="text-base sm:text-lg">
              {new Date().toLocaleDateString()}
            </span>
          }
          icon={CalendarDays}
          tone="slate"
        />
        <StatCard
          label="Status"
          value={
            <Badge tone="success" dot className="text-sm">
              Active
            </Badge>
          }
          icon={ShieldCheck}
          tone="emerald"
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.href}
                href={module.href}
                className="group flex flex-col rounded-xl border border-slate-200/80 bg-white p-4 shadow-card transition-colors hover:border-slate-300 sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ring-1 ring-inset ${module.iconTone}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <ArrowRight className="size-4 text-slate-400 transition-colors group-hover:text-blue-600" />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {module.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {module.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600">
                  Open
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}
