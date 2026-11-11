import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/States";

export type StatTone = "blue" | "emerald" | "amber" | "red" | "violet" | "slate";

const iconTone: Record<StatTone, string> = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  red: "bg-red-50 text-red-600 ring-red-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ElementType;
  tone?: StatTone;
  loading?: boolean;
  href?: string;
  className?: string;
}

/** KPI tile: label, headline value, supporting hint. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "slate",
  loading,
  href,
  className,
}: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
          {label}
        </p>
        {Icon && (
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
              iconTone[tone],
            )}
          >
            <Icon className="size-4" />
          </div>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : (
        <p className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-900 tabular-nums sm:text-2xl">
          {value}
        </p>
      )}
      {hint && (
        <p className="mt-1 truncate text-xs text-slate-500">{hint}</p>
      )}
    </>
  );

  const classes = cn(
    "block min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-card sm:p-4",
    href && "transition hover:border-slate-300 hover:shadow-md",
    className,
  );

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export default StatCard;
