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
  { title: "Add Employee", href: "/employees/create", icon: Users },
  { title: "View Employees", href: "/employees/view", icon: Eye },
];

const attendanceActions = [
  { title: "Mark Attendance", href: "/attendance/session", icon: CheckCircle2 },
  {
    title: "Daily Reports",
    href: "/attendance/daily-report",
    icon: CalendarDays,
  },
  { title: "Employee Attendance", href: "/attendance/employee", icon: Clock3 },
];

const locationActions = [
  { title: "Add Location", href: "/locations/create", icon: MapPin },
  { title: "View Locations", href: "/locations/view", icon: Building2 },
];

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();
  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-xl lg:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-red-100 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Admin Dashboard
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back,{" "}
                  <span className="text-blue-600">
                    {isLoading ? "Loading..." : isError ? "Admin" : userName}
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Manage employees, attendance operations, locations, and
                  reports from one centralized platform with a clear
                  security-first view.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <QuickBadge label="Employee Management" />
                  <QuickBadge label="Attendance Monitoring" />
                  <QuickBadge label="Location Tracking" />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
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

            <div className="space-y-6 xl:col-span-4">
              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
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

              <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
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
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function DashboardFeatureCard({
  item,
}: {
  item: { title: string; href: string; icon: React.ElementType };
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {item.title}
      </h3>
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
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all hover:border-blue-300 hover:bg-white"
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <span className="font-medium text-slate-900">{label}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-500" />
    </Link>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        {status}
      </span>
    </div>
  );
}

function QuickBadge({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900">
      {label}
    </div>
  );
}
