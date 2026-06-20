"use client";

import Link from "next/link";

import {
  ArrowRight,
  ClipboardCheck,
  Database,
  MapPin,
  Users,
} from "lucide-react";

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
    description: "Handle sectors and deployment locations.",
    href: "/locations",
    icon: MapPin,
  },
  {
    title: "System Architecture",
    description: "Employee, Attendance, and Location relations.",
    href: "#",
    icon: Database,
  },
];

export default function DeveloperQuickActions() {
  return (
    <section>
      {/* TITLE */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Access important management modules quickly.
        </p>
      </div>

      {/* GRID */}
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
  );
}
