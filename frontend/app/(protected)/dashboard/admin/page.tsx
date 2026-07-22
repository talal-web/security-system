"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  UserPlus,
  Users,
  ClipboardList,
  Clock3,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

const employeeActions = [
  {
    title: "Add Employee",
    description: "Register new security personnel.",
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

const attendanceActions = [
  {
    title: "Mark Attendance",
    description: "Mark today's attendance.",
    href: "/attendance/session",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    title: "Daily Report",
    description: "View today's attendance summary.",
    href: "/attendance/daily",
    icon: CalendarDays,
    color: "red",
  },
  {
    title: "Monthly Report",
    description: "Attendance analytics & exports.",
    href: "/attendance/monthly",
    icon: BarChart3,
    color: "blue",
  },
];

const locationActions = [
  {
    title: "Add Location",
    description: "Create a new deployment location.",
    href: "/locations/create",
    icon: MapPin,
    color: "blue",
  },
  {
    title: "View Locations",
    description: "Manage sectors and locations.",
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
        <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
          {/* Hero */}

          <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 via-transparent to-red-500/5" />

            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />

            <div className="relative z-10 p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-4 w-4" />
                Baidar Security Service
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">
                Welcome Back{" "}
                <span className="bg-linear-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
                  {isLoading ? "Loading..." : isError ? "Admin" : userName}
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-slate-600">
                Manage employees, mark attendance, deployment locations and
                operational reports from one centralized security management
                dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/attendance"
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03]"
                >
                  Start Attendance
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/employees/create"
                  className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Add Employee
                </Link>

                <Link
                  href="/employees/view"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Employees
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <QuickBadge label="Employee Management" />
                <QuickBadge label="Attendance Tracking" />
                <QuickBadge label="Location Management" />
                <QuickBadge label="Security Operations" />
              </div>
            </div>
          </section>

          {/* Dashboard */}

          <section className="grid gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-8">
              <DashboardSection
                title="Employee Management"
                description="Manage security guards, supervisors and staff."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {employeeActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                title="Attendance Operations"
                description="Daily attendance sessions and reporting."
              >
                <div className="grid gap-5 md:grid-cols-3">
                  {attendanceActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              <DashboardSection
                title="Location Management"
                description="Manage deployment sectors and locations."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {locationActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>
            </div>

            {/* Sidebar */}

            <aside className="space-y-6 xl:col-span-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-linear-to-br from-blue-600 to-red-500 p-3 text-white">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Quick Access</h3>

                    <p className="text-sm text-slate-500">
                      Frequently used modules
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <SidebarLink
                    href="/attendance/session"
                    label="Attendance Session"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/employees/create"
                    label="Add Employee"
                    icon={<UserPlus className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/employees/view"
                    label="View Employees"
                    icon={<Users className="h-5 w-5" />}
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

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">System Status</h3>

                    <p className="text-sm text-slate-500">
                      Current platform status
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <StatusItem label="Attendance Module" status="Operational" />

                  <StatusItem label="Employee Records" status="Updated" />

                  <StatusItem label="Location Tracking" status="Active" />

                  <StatusItem label="Report Generator" status="Ready" />
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
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function DashboardFeatureCard({
  item,
}: {
  item: {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    color: "blue" | "red";
  };
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
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.border}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${styles.gradient}`}
      />

      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.bg}`}
        >
          <Icon className={`h-7 w-7 ${styles.text}`} />
        </div>

        <ArrowRight className="h-5 w-5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-700" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>

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
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-linear-to-br from-blue-600 to-red-500 p-2 text-white">
          {icon}
        </div>

        <span className="font-medium text-slate-800">{label}</span>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
    </Link>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      <span className="rounded-full bg-linear-to-r from-blue-600 to-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
        {status}
      </span>
    </div>
  );
}

function QuickBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-blue-100 bg-linear-to-r from-blue-50 to-red-50 px-4 py-2 text-xs font-semibold text-slate-700">
      {label}
    </span>
  );
}
