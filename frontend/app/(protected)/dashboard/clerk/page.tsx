"use client";

import Link from "next/link";
// Add these icons to your existing import
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Layers3,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

type ActionItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: "blue" | "red";
};

const employeeActions: ActionItem[] = [
  {
    title: "Add Employee",
    description: "Register a new security employee.",
    href: "/employees/create",
    icon: UserPlus,
    color: "blue",
  },
  {
    title: "View Employees",
    description: "View and manage employee records.",
    href: "/employees/view",
    icon: Users,
    color: "red",
  },
];

const attendanceActions: ActionItem[] = [
  {
    title: "Mark Attendance",
    description: "Record today's employee attendance.",
    href: "/attendance/session",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    title: "Daily Report",
    description: "Review today's attendance records.",
    href: "/attendance/daily",
    icon: CalendarDays,
    color: "red",
  },
  {
    title: "Monthly Report",
    description: "Review monthly attendance and exports.",
    href: "/attendance/monthly",
    icon: BarChart3,
    color: "blue",
  },
];

const locationActions: ActionItem[] = [
  {
    title: "View Locations",
    description: "View and manage employee deployment locations.",
    href: "/locations/view",
    icon: MapPin,
    color: "blue",
  },
  {
    title: "View Sectors",
    description: "View sectors and their assigned locations.",
    href: "/sectors/view",
    icon: Building2,
    color: "red",
  },
];

export default function ClerkDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Clerk";

  return (
    <ProtectedRoute allowedRoles={["clerk"]}>
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-transparent to-red-500/5" />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <ClipboardList className="h-4 w-4" />
                    Clerk Portal
                  </div>

                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    Welcome back,{" "}
                    <span className="bg-linear-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                      {isLoading ? "Loading..." : isError ? "Clerk" : userName}
                    </span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Manage employee records, attendance, and operational reports
                    from your workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
                  <Link
                    href="/attendance/session"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Attendance
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/employees/view"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Users className="h-4 w-4" />
                    Employees
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Employee Management */}
          <DashboardSection
            title="Employee Management"
            description="Access employee records and registration tools."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {employeeActions.map((item) => (
                <DashboardFeatureCard key={item.title} item={item} />
              ))}
            </div>
          </DashboardSection>

          {/* Attendance */}
          <DashboardSection
            title="Attendance"
            description="Record attendance and review attendance reports."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {attendanceActions.map((item) => (
                <DashboardFeatureCard key={item.title} item={item} />
              ))}
            </div>
          </DashboardSection>

          {/* Locations & Sectors */}
          <DashboardSection
            title="Locations & Sectors"
            description="Access deployment locations and sector information."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {locationActions.map((item) => (
                <DashboardFeatureCard key={item.title} item={item} />
              ))}
            </div>
          </DashboardSection>

          {/* Bottom Grid */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Quick Access */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Quick Access</h2>

                  <p className="text-sm text-slate-500">
                    Frequently used clerk tools
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <QuickLink
                  href="/attendance/session"
                  label="Attendance Session"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />

                <QuickLink
                  href="/employees/create"
                  label="Add Employee"
                  icon={<UserPlus className="h-4 w-4" />}
                />

                <QuickLink
                  href="/employees/view"
                  label="View Employees"
                  icon={<Users className="h-4 w-4" />}
                />

                <QuickLink
                  href="/attendance/daily"
                  label="Daily Report"
                  icon={<CalendarDays className="h-4 w-4" />}
                />

                <QuickLink
                  href="/attendance/monthly"
                  label="Monthly Report"
                  icon={<BarChart3 className="h-4 w-4" />}
                />
                <QuickLink
                  href="/locations/view"
                  label="View Locations"
                  icon={<MapPin className="h-4 w-4" />}
                />

                <QuickLink
                  href="/sectors/view"
                  label="View Sectors"
                  icon={<Layers3 className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Workspace Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Workspace Status</h2>

                  <p className="text-sm text-slate-500">
                    Clerk operational modules
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <StatusItem label="Attendance" status="Available" />

                <StatusItem label="Employee Records" status="Available" />

                <StatusItem label="Daily Reports" status="Available" />

                <StatusItem label="Monthly Reports" status="Available" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

function DashboardSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      {children}
    </section>
  );
}

function DashboardFeatureCard({ item }: { item: ActionItem }) {
  const Icon = item.icon;

  const styles =
    item.color === "blue"
      ? {
          gradient: "from-blue-600 to-blue-500",
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "group-hover:border-blue-300",
        }
      : {
          gradient: "from-red-600 to-red-500",
          bg: "bg-red-50",
          text: "text-red-600",
          border: "group-hover:border-red-300",
        };

  return (
    <Link
      href={item.href}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${styles.border}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${styles.gradient}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.bg}`}
        >
          <Icon className={`h-6 w-6 ${styles.text}`} />
        </div>

        <ArrowRight className="mt-1 h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-slate-900">{item.title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white p-2 text-slate-600 shadow-sm">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
    </Link>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        {status}
      </span>
    </div>
  );
}
