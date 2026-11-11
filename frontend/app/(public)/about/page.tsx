"use client";

import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Target,
} from "lucide-react";

import CompanyShowcase from "@/components/about/CompanyShowCase";
import { ButtonLink } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 lg:space-y-10 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white px-5 py-12 shadow-card sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-card">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              About Baidar
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Secure Workforce
              <span className="block text-blue-600">
                Operations, Simplified
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              One clean platform for guards, attendance, and location
              operations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/dashboard/admin"
                size="lg"
                className="h-11 w-full px-5 sm:w-auto"
              >
                Open Dashboard
                <ArrowRight />
              </ButtonLink>

              <ButtonLink
                href="/attendance"
                variant="secondary"
                size="lg"
                className="h-11 w-full px-5 sm:w-auto"
              >
                Attendance
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <FeatureCard
            icon={<Target className="h-5 w-5" />}
            title="Mission"
            description="Make daily security operations simple and reliable."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Security First"
            description="Role-based access and protected operational flows."
          />

          <FeatureCard
            icon={<Globe2 className="h-5 w-5" />}
            title="Built To Scale"
            description="Responsive SaaS experience for teams of any size."
          />
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white px-5 py-10 shadow-card sm:px-8 sm:py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Why Teams Choose Us
              </h2>

              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                Essential workforce tools in one secure, modern system.
              </p>

              <div className="mt-6 space-y-3">
                <OverviewItem text="Employee Management" />
                <OverviewItem text="Attendance Tracking" />
                <OverviewItem text="Location Management" />
                <OverviewItem text="Responsive Dashboard" />
                <OverviewItem text="Secure Access" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatsCard value="24/7" label="Operations" />
              <StatsCard value="100%" label="Responsive" />
              <StatsCard value="RBAC" label="Access" />
              <StatsCard value="Live" label="Insights" />
            </div>
          </div>
        </section>

        <CompanyShowcase />
      </div>
    </div>
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
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function OverviewItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
}

function StatsCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-4 text-center sm:p-5">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
