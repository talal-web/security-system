"use client";

import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import { useMe } from "@/hooks/auth/useMe";

const employeeActions = [
  {
    title: "Add Employee",
    href: "/employees/create",
    icon: Users,
  },

  {
    title: "View Employees",
    href: "/employees/view",
    icon: Eye,
  },
];

const attendanceActions = [
  {
    title: "Mark Attendance",
    href: "/attendance/mark",
    icon: CheckCircle2,
  },

  {
    title: "Monthly Reports",
    href: "/attendance/date",
    icon: CalendarDays,
  },

  {
    title: "Employee Attendance",
    href: "/attendance/employee",
    icon: Clock3,
  },
];

const locationActions = [
  {
    title: "Add Location",
    href: "/locations/create",
    icon: MapPin,
  },

  {
    title: "View Locations",
    href: "/locations/view",
    icon: Building2,
  },
];

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-gray-100 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          {/* ================= HERO ================= */}

          <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              {/* LEFT */}

              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Admin Dashboard
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Welcome back,{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {isLoading ? "Loading..." : isError ? "Admin" : userName}
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-neutral-400 sm:text-base">
                  Manage employees, attendance operations, locations, and
                  reports from one centralized platform.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <QuickBadge label="Employee Management" />
                  <QuickBadge label="Attendance Monitoring" />
                  <QuickBadge label="Location Tracking" />
                </div>
              </div>

              {/* RIGHT STATS */}

              <div className="grid grid-cols-2 gap-4 xl:w-[420px]">
                <StatCard
                  title="Employees"
                  value="Management"
                  icon={<Users className="h-5 w-5" />}
                />

                <StatCard
                  title="Attendance"
                  value="Tracking"
                  icon={<CalendarDays className="h-5 w-5" />}
                />

                <StatCard
                  title="Locations"
                  value="Monitoring"
                  icon={<MapPin className="h-5 w-5" />}
                />

                <StatCard
                  title="Operations"
                  value="Control"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
              </div>
            </div>
          </section>

          {/* ================= MAIN GRID ================= */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* ================= LEFT SIDE ================= */}

            <div className="space-y-6 xl:col-span-8">
              {/* EMPLOYEE SECTION */}

              <DashboardSection
                title="Employee Management"
                description="Manage employee profiles and records."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {employeeActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              {/* ATTENDANCE SECTION */}

              <DashboardSection
                title="Attendance Operations"
                description="Manage daily attendance workflow and reports."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {attendanceActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>

              {/* LOCATION SECTION */}

              <DashboardSection
                title="Location & Sector Management"
                description="Create and monitor all attendance locations."
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {locationActions.map((item) => (
                    <DashboardFeatureCard key={item.title} item={item} />
                  ))}
                </div>
              </DashboardSection>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}

            <div className="space-y-6 xl:col-span-4">
              {/* QUICK PANEL */}

              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Quick Access
                </h2>

                <div className="mt-5 space-y-3">
                  <SidebarLink
                    href="/attendance/mark"
                    label="Mark Attendance"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/employees/create"
                    label="Add Employee"
                    icon={<Users className="h-5 w-5" />}
                  />

                  <SidebarLink
                    href="/locations/create"
                    label="Add Location"
                    icon={<MapPin className="h-5 w-5" />}
                  />
                </div>
              </div>

              {/* SYSTEM STATUS */}

              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  System Status
                </h2>

                <div className="mt-5 space-y-4">
                  <StatusItem label="Attendance Module" status="Operational" />

                  <StatusItem label="Employee Records" status="Updated" />

                  <StatusItem label="Location Tracking" status="Active" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}

/* ================= SECTION ================= */

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
    <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* ================= FEATURE CARD ================= */

function DashboardFeatureCard({ item }: any) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group rounded-3xl border border-gray-200 bg-gray-50 p-5 transition-all hover:border-blue-300 hover:bg-white hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-neutral-500" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
        {item.title}
      </h3>
    </Link>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>

        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {value}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
  );
}

/* ================= SIDEBAR LINK ================= */

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
      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/20"
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>

        <span className="font-medium text-gray-800 dark:text-white">
          {label}
        </span>
      </div>

      <ArrowRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}

/* ================= STATUS ITEM ================= */

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 dark:border-neutral-800">
      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
        {label}
      </span>

      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {status}
      </span>
    </div>
  );
}

/* ================= QUICK BADGE ================= */

function QuickBadge({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
      {label}
    </div>
  );
}
