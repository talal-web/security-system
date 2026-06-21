"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    title: "Today's Attendance",
    description:
      "Mark attendance, update locations, shifts and employee status.",
    href: "/attendance/session",
    icon: ClipboardCheck,
  },
  {
    title: "Daily Report",
    description: "View attendance records for any selected date.",
    href: "/attendance/daily-report",
    icon: CalendarDays,
  },
  {
    title: "Monthly Report",
    description: "Attendance trends, present/absent ratios and summaries.",
    href: "/attendance/monthly-report",
    icon: BarChart3,
  },
  {
    title: "Employee History",
    description: "Track attendance history of individual employees.",
    href: "/attendance/employee",
    icon: Users,
  },
  {
    title: "Location Attendance",
    description: "Analyze attendance by location and sector.",
    href: "/attendance/location",
    icon: MapPin,
  },
];

export default function AttendanceDashboardPage() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance Management
        </h1>

        <p className="text-muted-foreground">
          Manage attendance, reports, employee records and location-wise
          analytics from one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TopStat title="Today's Attendance" value="Mark" />

        <TopStat title="Daily Reports" value="View" />

        <TopStat title="Monthly Reports" value="Analytics" />

        <TopStat title="Employees" value="History" />
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl border p-3">
                  <Icon className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-semibold">{module.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {module.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Workflow */}
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Daily Workflow</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <WorkflowStep
            step="1"
            title="Mark Attendance"
            path="/attendance/session"
          />

          <WorkflowStep
            step="2"
            title="Review Daily Report"
            path="/attendance/daily-report"
          />

          <WorkflowStep
            step="3"
            title="Analyze Monthly Data"
            path="/attendance/monthly-report"
          />

          <WorkflowStep
            step="4"
            title="Review Employee History"
            path="/attendance/employee"
          />
        </div>
      </div>
    </div>
  );
}

function TopStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>

      <h3 className="mt-2 text-xl font-bold">{value}</h3>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  path,
}: {
  step: string;
  title: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      className="rounded-xl border p-4 transition hover:shadow-md"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border font-bold">
        {step}
      </div>

      <h3 className="font-medium">{title}</h3>
    </Link>
  );
}
