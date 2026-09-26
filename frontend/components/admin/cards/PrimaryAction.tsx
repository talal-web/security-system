import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { ActionItem } from "@/components/admin/dashboard.types";

export default function PrimaryAction({ item }: { item: ActionItem }) {
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
