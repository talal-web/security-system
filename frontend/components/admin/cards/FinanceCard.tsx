import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { FinanceModule } from "@/components/admin/dashboard.types";

type FinanceCardProps = {
  module: FinanceModule;
};

export default function FinanceCard({ module }: FinanceCardProps) {
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
