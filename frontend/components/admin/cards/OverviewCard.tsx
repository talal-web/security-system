import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { OverviewItem } from "@/components/admin/dashboard.types";

export default function OverviewCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: OverviewItem) {
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
