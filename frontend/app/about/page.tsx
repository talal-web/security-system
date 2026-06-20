"use client";

import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Globe2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8 lg:p-12">
          {/* BG EFFECTS */}

          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-10 xl:grid-cols-2 xl:items-center">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                Modern Attendance Management System
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Smart Workforce & Attendance Management Platform
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 dark:text-neutral-400">
                Our platform helps organizations manage employees, attendance
                operations, locations, reporting, and workforce tracking from
                one centralized modern dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/dashboard/admin"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/attendance/date"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-all hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                >
                  View Reports
                </Link>
              </div>
            </div>

            {/* RIGHT */}

            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<Users className="h-6 w-6" />}
                title="Employee Management"
                description="Manage workforce profiles and records."
              />

              <InfoCard
                icon={<Clock3 className="h-6 w-6" />}
                title="Attendance Tracking"
                description="Monitor daily attendance operations."
              />

              <InfoCard
                icon={<Building2 className="h-6 w-6" />}
                title="Sector Management"
                description="Handle locations and sectors efficiently."
              />

              <InfoCard
                icon={<CheckCircle2 className="h-6 w-6" />}
                title="Reports & Analytics"
                description="Generate attendance insights instantly."
              />
            </div>
          </div>
        </section>

        {/* ================= MISSION ================= */}

        <section className="grid gap-6 lg:grid-cols-3">
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Our Mission"
            description="To simplify workforce management through a modern, reliable, and scalable attendance system."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Security First"
            description="Built with role-based access, secure authentication, and protected operational workflows."
          />

          <FeatureCard
            icon={<Globe2 className="h-6 w-6" />}
            title="Modern Platform"
            description="Responsive, scalable, and optimized for modern organizations and administrative teams."
          />
        </section>

        {/* ================= PLATFORM OVERVIEW ================= */}

        <section className="rounded-[2.5rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* LEFT */}

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Why Choose Our System?
              </h2>

              <p className="mt-4 text-base leading-8 text-gray-600 dark:text-neutral-400">
                The system is designed for organizations that need efficient
                employee management, attendance monitoring, location tracking,
                and operational transparency.
              </p>

              <div className="mt-8 space-y-5">
                <OverviewItem text="Centralized employee records management" />

                <OverviewItem text="Fast attendance marking workflow" />

                <OverviewItem text="Sector and location-based tracking" />

                <OverviewItem text="Responsive dashboard for all devices" />

                <OverviewItem text="Professional admin monitoring tools" />
              </div>
            </div>

            {/* RIGHT */}

            <div className="grid gap-5 sm:grid-cols-2">
              <StatsCard value="24/7" label="System Availability" />

              <StatsCard value="100%" label="Responsive Interface" />

              <StatsCard value="Secure" label="Protected Access" />

              <StatsCard value="Modern" label="Professional Design" />
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <section className="rounded-[2.5rem] border border-gray-200 bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Manage Your Workforce Professionally
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                Streamline attendance operations, improve management workflows,
                and centralize employee systems through one modern platform.
              </p>
            </div>

            <Link
              href="/dashboard/admin"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

/* ================= OVERVIEW ITEM ================= */

function OverviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <p className="text-sm leading-7 text-gray-700 dark:text-neutral-300">
        {text}
      </p>
    </div>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {value}
      </h3>

      <p className="mt-2 text-sm font-medium text-gray-600 dark:text-neutral-400">
        {label}
      </p>
    </div>
  );
}
