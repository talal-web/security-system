"use client";

import { dashboardHeaderActions } from "@/components/admin/dashboard.config";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

type DashboardHeaderProps = {
  userName: string;
  isLoading: boolean;
  isError: boolean;
  /** Portal label, e.g. "Administration". */
  portal?: string;
  /** Name shown when the user lookup failed. */
  fallbackName?: string;
  description?: string;
  actions?: readonly {
    href: string;
    label: string;
    icon: React.ElementType;
    variant: "primary" | "secondary";
  }[];
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({
  userName,
  isLoading,
  isError,
  portal = "Administration",
  fallbackName = "Admin",
  description = "Manage employees, attendance, payroll operations, bonuses, security locations, and system administration from one place.",
  actions = dashboardHeaderActions,
}: DashboardHeaderProps) {
  const { getAreaAwareHref, selectedArea } = useSelectedArea();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{today}</span>
          <span className="text-slate-300">•</span>
          <Badge tone="info">{portal}</Badge>
          {selectedArea && <Badge tone="neutral">{selectedArea.name}</Badge>}
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
          {getGreeting()},{" "}
          {isLoading ? "..." : isError ? fallbackName : userName}
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
        {actions.map(({ href, label, icon: Icon, variant }) => (
          <ButtonLink
            key={label}
            href={getAreaAwareHref(href)}
            variant={variant}
            size="lg"
          >
            <Icon />
            {label}
          </ButtonLink>
        ))}
      </div>
    </header>
  );
}
