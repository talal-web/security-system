// app/dashboard/developer/page.tsx

"use client";

import Link from "next/link";

import {
  Code2,
  Users,
  MapPin,
  ClipboardCheck,
  ShieldCheck,
  Activity,
  ArrowRight,
  Database,
} from "lucide-react";

const stats = [
  {
    title: "Employees Module",
    value: "Manage Staff",
    icon: Users,
    href: "/employees",
  },
  {
    title: "Attendance System",
    value: "Track Records",
    icon: ClipboardCheck,
    href: "/dashboard/attendance/mark",
  },
  {
    title: "Locations",
    value: "Manage Sectors",
    icon: MapPin,
    href: "/locations",
  },
  {
    title: "Security Roles",
    value: "RBAC Enabled",
    icon: ShieldCheck,
    href: "/dashboard",
  },
];

const quickActions = [
  {
    title: "View Employees",
    description: "Manage employee profiles, records, and details.",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Mark Attendance",
    description: "Track and manage employee attendance records.",
    href: "/dashboard/attendance/mark",
    icon: ClipboardCheck,
  },
  {
    title: "Manage Locations",
    description: "Handle sectors, offices, and deployment locations.",
    href: "/locations",
    icon: MapPin,
  },
  {
    title: "System Architecture",
    description: "Employee, Attendance, and Location relational structure.",
    href: "#",
    icon: Database,
  },
];

export default function DeveloperDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          {/* LEFT */}
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-slate-900 p-4 text-white shadow-lg">
              <Code2 className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Developer Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Monitor system modules, manage platform resources, and maintain
                the employee attendance management system.
              </p>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-500 p-2 text-white">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                  System Status
                </p>

                <h2 className="text-lg font-bold text-green-900">
                  Operational
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Access important management modules quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* ICON */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 transition group-hover:bg-slate-900 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                {/* CONTENT */}
                <div className="mt-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {action.description}
                  </p>
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:text-slate-900">
                  Open Module
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
