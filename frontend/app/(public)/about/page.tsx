"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Target,
} from "lucide-react";

import CompanyShowcase from "@/components/about/CompanyShowCase";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 lg:space-y-10 lg:px-8 lg:py-8">
        <section className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white px-5 py-12 shadow-lg shadow-slate-200/35 sm:px-8 sm:py-14 lg:px-12 lg:py-18">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-100/70 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              About Baidar
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Secure Workforce
              <span className="block text-blue-600">
                Operations, Simplified
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              One clean platform for guards, attendance, and location
              operations.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard/admin"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-sky-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/attendance"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 sm:w-auto"
              >
                Attendance
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Mission"
            description="Make daily security operations simple and reliable."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Security First"
            description="Role-based access and protected operational flows."
          />

          <FeatureCard
            icon={<Globe2 className="h-6 w-6" />}
            title="Built To Scale"
            description="Responsive SaaS experience for teams of any size."
          />
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white px-5 py-10 shadow-lg shadow-slate-200/35 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Why Teams Choose Us
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Essential workforce tools in one secure, modern system.
              </p>

              <div className="mt-7 space-y-3.5">
                <OverviewItem text="Employee Management" />
                <OverviewItem text="Attendance Tracking" />
                <OverviewItem text="Location Management" />
                <OverviewItem text="Responsive Dashboard" />
                <OverviewItem text="Secure Access" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatsCard value="24/7" label="Operations" />
              <StatsCard value="100%" label="Responsive" />
              <StatsCard value="RBAC" label="Access" />
              <StatsCard value="Live" label="Insights" />
            </div>
          </div>
        </section>
      </div>
      <CompanyShowcase />
    </main>
  );
}

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
    <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function OverviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
}

function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white sm:p-5">
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>

      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}
