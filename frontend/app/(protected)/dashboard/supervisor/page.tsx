"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  MapPin,
  Users,
  Building2,
  ShieldCheck,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

type Action = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const actions: Action[] = [
  {
    title: "View Employees",
    description: "View security personnel and employee information.",
    href: "/employees/view",
    icon: Users,
  },
  {
    title: "View Locations",
    description: "View deployment locations and assigned sectors.",
    href: "/locations/view",
    icon: MapPin,
  },
  {
    title: "View Sectors",
    description: "Browse available sectors and their locations.",
    href: "/sectors/view",
    icon: Building2,
  },
  {
    title: "Attendance Session",
    description: "View the current attendance session and assignments.",
    href: "/attendance/session",
    icon: CalendarCheck2,
  },
];

export default function SupervisorDashboardPage() {
  const { data, isLoading } = useMe();

  const userName = data?.user?.name || "Supervisor";

  return (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-transparent to-slate-500/5" />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <ShieldCheck className="h-4 w-4" />
                    Supervisor Dashboard
                  </div>

                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Welcome back,{" "}
                    <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      {isLoading ? "Loading..." : userName}
                    </span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Access employee information, deployment locations, sectors,
                    and attendance operations.
                  </p>
                </div>

                <Link
                  href="/attendance/session"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Attendance Session
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Supervisor Access
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quick access to the information and operations available to
                supervisors.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {actions.map((action) => (
                <SupervisorActionCard key={action.href} action={action} />
              ))}
            </div>
          </section>

          {/* Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Supervisor Permissions
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your account provides access to operational information such
                  as employees, deployment locations, sectors, and attendance
                  sessions. Administrative management and data modification
                  features are restricted to authorized roles.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function SupervisorActionCard({ action }: { action: Action }) {
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 to-blue-400" />

      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="h-7 w-7" />
        </div>

        <ArrowRight className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900">{action.title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {action.description}
        </p>
      </div>
    </Link>
  );
}
