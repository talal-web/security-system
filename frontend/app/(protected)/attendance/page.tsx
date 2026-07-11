"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CalendarMinus,
  ClipboardCheck,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

const modules = [
  {
    title: "Mark Attendance",
    description:
      "Start attendance sessions, record employee attendance, and manage daily workforce status.",
    href: "/attendance/session",
    icon: ClipboardCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    border: "group-hover:border-blue-300",
  },
  {
    title: "Daily Attendance",
    description:
      "Review attendance records, search employees, verify absentees, and export reports.",
    href: "/attendance/daily",
    icon: CalendarDays,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    border: "group-hover:border-emerald-300",
  },
  {
    title: "Monthly Report",
    description:
      "Analyze attendance trends, generate monthly reports, and export payroll-ready Excel files.",
    href: "/attendance/monthly",
    icon: BarChart3,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    border: "group-hover:border-violet-300",
  },
];

const stats = [
  {
    title: "Employees",
    value: "--",
    subtitle: "Registered workforce",
    icon: Users,
    iconColor: "text-blue-700",
    bg: "bg-blue-100",
  },
  {
    title: "Present",
    value: "--",
    subtitle: "Currently available",
    icon: UserCheck,
    iconColor: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  {
    title: "Absent",
    value: "--",
    subtitle: "Not reported today",
    icon: UserX,
    iconColor: "text-red-700",
    bg: "bg-red-100",
  },
  {
    title: "On Leave",
    value: "--",
    subtitle: "Approved leave",
    icon: CalendarMinus,
    iconColor: "text-amber-700",
    bg: "bg-amber-100",
  },
];

export default function AttendanceDashboardPage() {
  return (
    <div className="space-y-10 bg-slate-50 p-6">
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-red-50 shadow-sm">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-60" />

        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-red-100 blur-3xl opacity-50" />

        <div className="relative flex flex-col gap-10 p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                Workforce Management
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
                ● System Online
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Attendance Dashboard
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Efficiently manage employee attendance, monitor workforce
              activity, review attendance reports, and maintain accurate
              attendance records through one centralized platform.
            </p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today&apos;s Date
              </p>

              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {new Date().toLocaleDateString()}
              </h3>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Attendance Status
              </p>

              <h3 className="mt-2 text-xl font-semibold text-emerald-600">
                Active Session
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-2 text-slate-500">
            Access frequently used attendance modules.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.href}
                href={module.href}
                className={`group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${module.border}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${module.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${module.iconColor}`} />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {module.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {module.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 font-medium text-blue-600">
                  Open Module
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Daily Workflow</h2>

          <p className="mt-2 text-slate-500">
            Follow the recommended attendance process to maintain accurate and
            consistent workforce records.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <WorkflowStep
            step="01"
            title="Mark Attendance"
            description="Start today's attendance session, record employee attendance and verify attendance status."
            href="/attendance/session"
          />

          <WorkflowStep
            step="02"
            title="Review Daily Report"
            description="Review attendance records, verify absentees and identify attendance issues."
            href="/attendance/daily"
          />

          <WorkflowStep
            step="03"
            title="Generate Monthly Report"
            description="Generate attendance analytics and payroll-ready monthly reports."
            href="/attendance/monthly"
          />
        </div>
      </section>

      {/* ================= BEST PRACTICES ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <ShieldCheck className="h-7 w-7 text-blue-700" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Attendance Best Practices
            </h2>

            <p className="mt-1 text-slate-500">
              Improve attendance accuracy by following these recommended
              practices.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            {
              title: "Start Attendance Early",
              description:
                "Open attendance sessions before employee shifts begin to ensure timely attendance recording.",
            },
            {
              title: "Verify Absentees",
              description:
                "Confirm absent employees before closing attendance sessions to eliminate reporting mistakes.",
            },
            {
              title: "Review Daily Reports",
              description:
                "Review attendance records every day before generating monthly reports or payroll.",
            },
            {
              title: "Export Reports Regularly",
              description:
                "Maintain regular Excel exports to simplify payroll processing and record management.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <ShieldCheck className="h-5 w-5 text-blue-700" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface WorkflowStepProps {
  step: string;
  title: string;
  description: string;
  href: string;
}

function WorkflowStep({ step, title, description, href }: WorkflowStepProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-50 blur-2xl opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            {step}
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>

          <p className="mt-3 leading-7 text-slate-600">{description}</p>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 font-medium text-blue-600">
          Continue
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
