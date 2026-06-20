"use client";

import Link from "next/link";

import { ClipboardCheck, MapPin, ShieldCheck, Users } from "lucide-react";

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

export default function DeveloperStats() {
  return (
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
  );
}
