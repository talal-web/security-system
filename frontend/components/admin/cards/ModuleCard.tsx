import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { ManagementModule } from "@/components/admin/dashboard.types";

type ModuleCardProps = {
  module: ManagementModule;
};

export default function ModuleCard({ module }: ModuleCardProps) {
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
