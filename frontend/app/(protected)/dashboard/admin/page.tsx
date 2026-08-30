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
  FileWarning,
  HandCoins,
  MapPin,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

type Tone = "blue" | "red" | "slate" | "amber" | "emerald";

type ActionItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  tone: Tone;
};

const primaryActions: ActionItem[] = [
  {
    title: "Manage Users",
    description: "System access & roles",
    href: "/users",
    icon: UserCog,
    tone: "blue",
  },
  {
    title: "Manage Employees",
    description: "Employee records",
    href: "/employees/view",
    icon: Users,
    tone: "slate",
  },
  {
    title: "Manage Advances",
    description: "Employee advances",
    href: "/advances",
    icon: HandCoins,
    tone: "amber",
  },
  {
    title: "Manage Fines",
    description: "Employee fines",
    href: "/fines",
    icon: FileWarning,
    tone: "red",
  },
  {
    title: "Manage Sectors",
    description: "Security sectors",
    href: "/sectors/view",
    icon: MapPin,
    tone: "emerald",
  },
  {
    title: "Manage Locations",
    description: "Security locations",
    href: "/locations/view",
    icon: Building2,
    tone: "blue",
  },
];

const modules = [
  {
    title: "Users",
    description: "Manage system access",
    icon: UserCog,
    tone: "blue" as const,
    items: [
      {
        label: "View Users",
        href: "/users",
        icon: UserCog,
      },
      {
        label: "Add User",
        href: "/users/create",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Employees",
    description: "Manage employee records",
    icon: Users,
    tone: "slate" as const,
    items: [
      {
        label: "View Employees",
        href: "/employees/view",
        icon: Users,
      },
      {
        label: "Add Employee",
        href: "/employees/create",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Advances",
    description: "Manage employee advances",
    icon: HandCoins,
    tone: "amber" as const,
    items: [
      {
        label: "Manage Advances",
        href: "/advances",
        icon: HandCoins,
      },
    ],
  },
  {
    title: "Fines",
    description: "Manage employee fines",
    icon: FileWarning,
    tone: "red" as const,
    items: [
      {
        label: "Manage Fines",
        href: "/fines",
        icon: FileWarning,
      },
    ],
  },
  {
    title: "Sectors",
    description: "Manage security sectors",
    icon: MapPin,
    tone: "emerald" as const,
    items: [
      {
        label: "View Sectors",
        href: "/sectors/view",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Locations",
    description: "Manage security locations",
    icon: Building2,
    tone: "blue" as const,
    items: [
      {
        label: "View Locations",
        href: "/locations/view",
        icon: Building2,
      },
    ],
  },
];

const toneStyles = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    soft: "bg-blue-50/60",
    hover: "hover:border-blue-200 hover:bg-blue-50/40",
    dot: "bg-blue-500",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    soft: "bg-red-50/60",
    hover: "hover:border-red-200 hover:bg-red-50/40",
    dot: "bg-red-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    soft: "bg-amber-50/60",
    hover: "hover:border-amber-200 hover:bg-amber-50/40",
    dot: "bg-amber-500",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    soft: "bg-slate-50",
    hover: "hover:border-slate-300 hover:bg-slate-50",
    dot: "bg-slate-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    soft: "bg-emerald-50/60",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/40",
    dot: "bg-emerald-500",
  },
};

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-4 p-3 sm:space-y-5 sm:p-5 lg:p-6">
          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Administration
                  </span>
                </div>

                <h1 className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Welcome,{" "}
                  <span className="text-blue-600">
                    {isLoading ? "Loading..." : isError ? "Admin" : userName}
                  </span>
                </h1>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Manage users, employees, finances, and security operations.
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href="/users"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <UserCog className="h-3.5 w-3.5" />
                  Manage Users
                </Link>

                <Link
                  href="/attendance/monthly"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Monthly Report
                </Link>
              </div>
            </div>
          </section>

          {/* ====================================================== */}
          {/* ADMIN OVERVIEW */}
          {/* ====================================================== */}

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Administration Overview
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Quick access to core management areas
                </p>
              </div>

              <ShieldCheck className="h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              <OverviewCard
                label="Users"
                value="Manage"
                icon={UserCog}
                tone="blue"
                href="/users"
              />

              <OverviewCard
                label="Employees"
                value="Manage"
                icon={Users}
                tone="slate"
                href="/employees/view"
              />

              <OverviewCard
                label="Advances"
                value="Manage"
                icon={HandCoins}
                tone="amber"
                href="/advances"
              />

              <OverviewCard
                label="Fines"
                value="Manage"
                icon={FileWarning}
                tone="red"
                href="/fines"
              />

              <OverviewCard
                label="Sectors"
                value="Manage"
                icon={MapPin}
                tone="emerald"
                href="/sectors/view"
              />

              <OverviewCard
                label="Locations"
                value="Manage"
                icon={Building2}
                tone="blue"
                href="/locations/view"
              />
            </div>
          </section>

          {/* ====================================================== */}
          {/* PRIMARY ACTIONS */}
          {/* ====================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Primary Actions
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Access the most important administration modules
                </p>
              </div>

              <ClipboardList className="h-4 w-4 text-slate-400" />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {primaryActions.map((item) => (
                <PrimaryAction key={item.title} item={item} />
              ))}
            </div>
          </section>

          {/* ====================================================== */}
          {/* MAIN CONTENT + SIDEBAR */}
          {/* ====================================================== */}

          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            {/* ================================================== */}
            {/* MANAGEMENT MODULES */}
            {/* ================================================== */}

            <section>
              <div className="mb-3">
                <h2 className="text-sm font-bold text-slate-900">Management</h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Manage the main areas of the security system
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {modules.map((module) => (
                  <ModuleCard key={module.title} module={module} />
                ))}
              </div>
            </section>

            {/* ================================================== */}
            {/* SIDEBAR */}
            {/* ================================================== */}

            <aside className="space-y-3">
              {/* ================================================ */}
              {/* SYSTEM STATUS */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      System Status
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Platform services
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock3 className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <StatusItem label="User Management" />
                  <StatusItem label="Employee Records" />
                  <StatusItem label="Advances" />
                  <StatusItem label="Fines" />
                  <StatusItem label="Locations" />
                </div>
              </div>

              {/* ================================================ */}
              {/* ATTENDANCE */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Attendance
                    </h2>

                    <p className="text-[11px] text-slate-500">
                      Operations & reports
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <CompactLink
                    href="/attendance/session"
                    label="Attendance Session"
                    icon={CheckCircle2}
                  />

                  <CompactLink
                    href="/attendance/daily"
                    label="Daily Report"
                    icon={CalendarDays}
                  />

                  <CompactLink
                    href="/attendance/monthly"
                    label="Monthly Report"
                    icon={BarChart3}
                  />
                </div>
              </div>

              {/* ================================================ */}
              {/* QUICK ADMIN */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <UserPlus className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Quick Admin
                    </h2>

                    <p className="text-[11px] text-slate-500">
                      Common creation actions
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <CompactLink
                    href="/users/create"
                    label="Add User"
                    icon={UserPlus}
                  />

                  <CompactLink
                    href="/employees/create"
                    label="Add Employee"
                    icon={UserPlus}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

/* ================================================================ */
/* OVERVIEW CARD */
/* ================================================================ */

function OverviewCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone: keyof typeof toneStyles;
  href: string;
}) {
  const styles = toneStyles[tone];

  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-3.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </div>

      <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
        {value}
      </p>
    </Link>
  );
}

/* ================================================================ */
/* PRIMARY ACTION */
/* ================================================================ */

function PrimaryAction({ item }: { item: ActionItem }) {
  const Icon = item.icon;
  const styles = toneStyles[item.tone];

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 transition ${styles.hover}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-800">
          {item.title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {item.description}
        </p>
      </div>

      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </Link>
  );
}

/* ================================================================ */
/* MODULE CARD */
/* ================================================================ */

function ModuleCard({
  module,
}: {
  module: {
    title: string;
    description: string;
    icon: React.ElementType;
    tone: keyof typeof toneStyles;
    items: {
      label: string;
      href: string;
      icon: React.ElementType;
    }[];
  };
}) {
  const Icon = module.icon;
  const styles = toneStyles[module.tone];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-900">
            {module.title}
          </h2>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {module.description}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {module.items.map((item) => {
          const ItemIcon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-slate-50"
            >
              <ItemIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:text-slate-600" />

              <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600 group-hover:text-slate-900">
                {item.label}
              </span>

              <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================ */
/* STATUS ITEM */
/* ================================================================ */

function StatusItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

        <span className="truncate text-[11px] font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-[9px] font-semibold text-emerald-600">Online</span>
    </div>
  );
}

/* ================================================================ */
/* COMPACT LINK */
/* ================================================================ */

function CompactLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <Icon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-600" />

      <span className="flex-1 truncate text-[11px] font-medium text-slate-600 group-hover:text-slate-900">
        {label}
      </span>

      <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </Link>
  );
}
