"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

type DashboardActionItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: "blue" | "red";
};

const userActions: DashboardActionItem[] = [
  {
    title: "Manage Users",
    description: "Create, update, deactivate, and manage system users.",
    href: "/users",
    icon: UserCog,
    color: "blue",
  },
  {
    title: "Add User",
    description: "Create an account for administrators and staff.",
    href: "/users/create",
    icon: UserPlus,
    color: "red",
  },
];

const employeeActions: DashboardActionItem[] = [
  {
    title: "Add Employee",
    description: "Register new security personnel and staff.",
    href: "/employees/create",
    icon: UserPlus,
    color: "blue",
  },
  {
    title: "View Employees",
    description: "Manage employee records and profiles.",
    href: "/employees/view",
    icon: Users,
    color: "red",
  },
];

const attendanceActions: DashboardActionItem[] = [
  {
    title: "Mark Attendance",
    description: "Manage today's employee attendance.",
    href: "/attendance/session",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    title: "Daily Report",
    description: "Review today's attendance summary.",
    href: "/attendance/daily",
    icon: CalendarDays,
    color: "red",
  },
  {
    title: "Monthly Report",
    description: "Analyze attendance and export reports.",
    href: "/attendance/monthly",
    icon: BarChart3,
    color: "blue",
  },
];

const locationActions: DashboardActionItem[] = [
  {
    title: "View Sectors",
    description: "Manage and view sectors.",
    href: "/sectors/view",
    icon: MapPin,
    color: "blue",
  },
  {
    title: "View Locations",
    description: "Manage sectors, locations, and deployment areas.",
    href: "/locations/view",
    icon: Building2,
    color: "red",
  },
];

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-transparent to-red-500/5" />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <ShieldCheck className="h-4 w-4" />
                    Administration
                  </div>

                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    Welcome back,{" "}
                    <span className="bg-linear-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                      {isLoading ? "Loading..." : isError ? "Admin" : userName}
                    </span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Manage users, employees, attendance, locations, and
                    operational records from your administration panel.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
                  <Link
                    href="/users"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <UserCog className="h-4 w-4" />
                    Manage Users
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/attendance/session"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Attendance
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Administration */}
          <DashboardSection
            title="Administration"
            description="Manage system users and administrative access."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {userActions.map((item) => (
                <DashboardFeatureCard
                  key={item.title}
                  item={item}
                  featured={item.title === "Manage Users"}
                />
              ))}
            </div>
          </DashboardSection>

          {/* Main Dashboard */}
          <section className="grid gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              {/* Employees */}
              <DashboardSection
                title="Employee Management"
                description="Manage security personnel, supervisors, and staff records."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {employeeActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              {/* Attendance */}
              <DashboardSection
                title="Attendance Operations"
                description="Manage attendance sessions and operational reports."
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {attendanceActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              {/* Locations */}
              <DashboardSection
                title="Location Management"
                description="Manage sectors and employee deployment locations."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {locationActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 xl:col-span-4">
              {/* Quick Access */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Quick Access</h3>

                    <p className="text-sm text-slate-500">
                      Frequently used administration tools
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <SidebarLink
                    href="/users"
                    label="Manage Users"
                    icon={<UserCog className="h-5 w-5" />}
                    primary
                  />

                  <SidebarLink
                    href="/employees/view"
                    label="View Employees"
                    icon={<Users className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/attendance/session"
                    label="Attendance Session"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/locations/view"
                    label="View Locations"
                    icon={<Building2 className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/attendance/daily"
                    label="Daily Report"
                    icon={<CalendarDays className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/attendance/monthly"
                    label="Monthly Report"
                    icon={<BarChart3 className="h-5 w-5" />}
                  />
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">System Status</h3>

                    <p className="text-sm text-slate-500">
                      Current platform status
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <StatusItem label="User Management" status="Operational" />

                  <StatusItem label="Employee Records" status="Operational" />

                  <StatusItem label="Attendance Module" status="Operational" />

                  <StatusItem
                    label="Location Management"
                    status="Operational"
                  />
                </div>
              </div>
            </aside>
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

function DashboardFeatureCard({
  item,
  featured = false,
}: {
  item: DashboardActionItem;
  featured?: boolean;
}) {
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
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${styles.border} ${
        featured ? "ring-1 ring-blue-100" : ""
      }`}
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

        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-600" />
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900">{item.title}</h3>

          {featured && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              Primary
            </span>
          )}
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  primary = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-xl border px-3.5 py-3 transition-all duration-200 ${
        primary
          ? "border-blue-200 bg-blue-50/70 hover:border-blue-300 hover:bg-blue-50"
          : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`rounded-lg p-2 ${
            primary
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          {icon}
        </div>

        <span
          className={`truncate text-sm font-medium ${
            primary ? "text-blue-700" : "text-slate-700"
          }`}
        >
          {label}
        </span>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
    </Link>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
      <span className="truncate text-sm font-medium text-slate-700">
        {label}
      </span>

      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        {status}
      </span>
    </div>
  );
}
