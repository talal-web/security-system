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
  Landmark,
  MapPin,
  ReceiptText,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useMe } from "@/hooks/auth/useMe";

type Tone = "blue" | "red" | "slate" | "amber" | "emerald" | "violet";

type ActionItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  tone: Tone;
};

const primaryActions: ActionItem[] = [
  {
    title: "Manage Employees",
    description: "Employee records & profiles",
    href: "/employees/view",
    icon: Users,
    tone: "slate",
  },
  {
    title: "Attendance Session",
    description: "Mark today's attendance",
    href: "/attendance/session",
    icon: CheckCircle2,
    tone: "blue",
  },
  {
    title: "Manage Advances",
    description: "Employee salary advances",
    href: "/advances",
    icon: HandCoins,
    tone: "amber",
  },
  {
    title: "Manage Deductions",
    description: "Salary deductions",
    href: "/deductions",
    icon: ReceiptText,
    tone: "violet",
  },
  {
    title: "Manage Fines",
    description: "Employee fines & penalties",
    href: "/fines",
    icon: FileWarning,
    tone: "red",
  },
  {
    title: "Monthly Attendance",
    description: "Attendance reports",
    href: "/attendance/monthly",
    icon: BarChart3,
    tone: "emerald",
  },
];

const managementModules = [
  {
    title: "Users",
    description: "System access & permissions",
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
    description: "Employee records & profiles",
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
    title: "Sectors",
    description: "Security sector management",
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
    description: "Security post management",
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

const financeModules = [
  {
    title: "Advances",
    description: "Employee salary advances",
    icon: HandCoins,
    tone: "amber" as const,
    href: "/advances",
    label: "Manage Advances",
  },
  {
    title: "Deductions",
    description: "Salary deductions & adjustments",
    icon: ReceiptText,
    tone: "violet" as const,
    href: "/deductions",
    label: "Manage Deductions",
  },
  {
    title: "Fines",
    description: "Employee fines & penalties",
    icon: FileWarning,
    tone: "red" as const,
    href: "/fines",
    label: "Manage Fines",
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
  violet: {
    icon: "bg-violet-50 text-violet-600",
    soft: "bg-violet-50/60",
    hover: "hover:border-violet-200 hover:bg-violet-50/40",
    dot: "bg-violet-500",
  },
};

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-5 p-3 sm:p-5 lg:p-6">
          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Administration Portal
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Welcome,{" "}
                  <span className="text-blue-600">
                    {isLoading ? "Loading..." : isError ? "Admin" : userName}
                  </span>
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                  Manage employees, attendance, payroll operations, security
                  locations, and system administration from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/employees/view"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Users className="h-4 w-4" />
                  View Employees
                </Link>

                <Link
                  href="/attendance/monthly"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <BarChart3 className="h-4 w-4" />
                  Reports
                </Link>
              </div>
            </div>
          </section>

          {/* ====================================================== */}
          {/* QUICK OVERVIEW */}
          {/* ====================================================== */}

          <section>
            <SectionHeading
              title="Quick Overview"
              description="Jump directly to the main operational areas"
              icon={Landmark}
            />

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              <OverviewCard
                label="Employees"
                value="Manage"
                icon={Users}
                tone="slate"
                href="/employees/view"
              />

              <OverviewCard
                label="Attendance"
                value="Manage"
                icon={CheckCircle2}
                tone="blue"
                href="/attendance/session"
              />

              <OverviewCard
                label="Advances"
                value="Manage"
                icon={HandCoins}
                tone="amber"
                href="/advances"
              />

              <OverviewCard
                label="Deductions"
                value="Manage"
                icon={ReceiptText}
                tone="violet"
                href="/deductions"
              />

              <OverviewCard
                label="Fines"
                value="Manage"
                icon={FileWarning}
                tone="red"
                href="/fines"
              />

              <OverviewCard
                label="Users"
                value="Manage"
                icon={UserCog}
                tone="blue"
                href="/users"
              />
            </div>
          </section>

          {/* ====================================================== */}
          {/* PRIMARY ACTIONS */}
          {/* ====================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading
              title="Quick Actions"
              description="Frequently used administration tasks"
              icon={ClipboardList}
              className="mb-4"
            />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {primaryActions.map((item) => (
                <PrimaryAction key={item.title} item={item} />
              ))}
            </div>
          </section>

          {/* ====================================================== */}
          {/* MANAGEMENT + SIDEBAR */}
          {/* ====================================================== */}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* ================================================== */}
            {/* MAIN */}
            {/* ================================================== */}

            <div className="space-y-5">
              {/* ================================================ */}
              {/* ORGANIZATION */}
              {/* ================================================ */}

              <section>
                <SectionHeading
                  title="Organization Management"
                  description="Manage the people and operational structure of the company"
                  icon={Building2}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {managementModules.map((module) => (
                    <ModuleCard key={module.title} module={module} />
                  ))}
                </div>
              </section>

              {/* ================================================ */}
              {/* PAYROLL & FINANCE */}
              {/* ================================================ */}

              <section>
                <SectionHeading
                  title="Payroll & Finance"
                  description="Manage employee financial transactions and salary adjustments"
                  icon={WalletCards}
                />

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {financeModules.map((module) => (
                    <FinanceCard key={module.title} module={module} />
                  ))}
                </div>
              </section>
            </div>

            {/* ================================================== */}
            {/* SIDEBAR */}
            {/* ================================================== */}

            <aside className="space-y-4">
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
                      Core platform services
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock3 className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <StatusItem label="User Management" />
                  <StatusItem label="Employee Records" />
                  <StatusItem label="Attendance" />
                  <StatusItem label="Payroll & Finance" />
                  <StatusItem label="Locations" />
                </div>
              </div>

              {/* ================================================ */}
              {/* ATTENDANCE */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CardHeading
                  title="Attendance"
                  description="Operations & reporting"
                  icon={CheckCircle2}
                  tone="blue"
                />

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
              {/* PAYROLL */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CardHeading
                  title="Payroll & Finance"
                  description="Salary-related operations"
                  icon={WalletCards}
                  tone="violet"
                />

                <div className="mt-3 space-y-1.5">
                  <CompactLink
                    href="/advances"
                    label="Employee Advances"
                    icon={HandCoins}
                  />

                  <CompactLink
                    href="/deductions"
                    label="Salary Deductions"
                    icon={ReceiptText}
                  />

                  <CompactLink
                    href="/fines"
                    label="Employee Fines"
                    icon={FileWarning}
                  />
                </div>
              </div>

              {/* ================================================ */}
              {/* QUICK ADMIN */}
              {/* ================================================ */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <CardHeading
                  title="Quick Admin"
                  description="Common creation actions"
                  icon={UserPlus}
                  tone="slate"
                />

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
/* SECTION HEADING */
/* ================================================================ */

function SectionHeading({
  title,
  description,
  icon: Icon,
  className = "",
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 sm:text-base">
            {title}
          </h2>
        </div>

        <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>

      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
    </div>
  );
}

/* ================================================================ */
/* CARD HEADING */
/* ================================================================ */

function CardHeading({
  title,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  tone: keyof typeof toneStyles;
}) {
  const styles = toneStyles[tone];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>

        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {description}
        </p>
      </div>
    </div>
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
      className="group rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-3.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </div>

      <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
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
      className={`group flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition duration-200 ${styles.hover}`}
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
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
/* FINANCE CARD */
/* ================================================================ */

function FinanceCard({
  module,
}: {
  module: {
    title: string;
    description: string;
    icon: React.ElementType;
    tone: keyof typeof toneStyles;
    href: string;
    label: string;
  };
}) {
  const Icon = module.icon;
  const styles = toneStyles[module.tone];

  return (
    <Link
      href={module.href}
      className={`group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.hover}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {module.title}
          </h3>

          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {module.description}
          </p>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3">
        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">
          {module.label}
        </span>
      </div>
    </Link>
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
