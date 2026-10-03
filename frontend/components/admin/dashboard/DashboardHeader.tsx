"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { dashboardHeaderActions } from "@/components/admin/dashboard.config";
import { useSelectedArea } from "@/components/area/AreaContext";

type DashboardHeaderProps = {
  userName: string;
  isLoading: boolean;
  isError: boolean;
};

export default function DashboardHeader({
  userName,
  isLoading,
  isError,
}: DashboardHeaderProps) {
  const { getAreaAwareHref } = useSelectedArea();

  return (
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
            Manage employees, attendance, payroll operations, bonuses, security
            locations, and system administration from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {dashboardHeaderActions.map(
            ({ href, label, icon: Icon, variant }) => (
              <Link
                key={label}
                href={getAreaAwareHref(href)}
                className={
                  variant === "primary"
                    ? "inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    : "inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
