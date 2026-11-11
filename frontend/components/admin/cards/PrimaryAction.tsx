"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { toneStyles } from "@/components/admin/dashboard.config";
import type { ActionItem } from "@/components/admin/dashboard.types";
import { useSelectedArea } from "@/components/area/AreaContext";

/** Compact navigation tile: tinted icon, title, one-line description. */
export default function PrimaryAction({ item }: { item: ActionItem }) {
  const { getAreaAwareHref } = useSelectedArea();
  const Icon = item.icon;
  const styles = toneStyles[item.tone];

  return (
    <Link
      href={getAreaAwareHref(item.href)}
      className="group flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 transition hover:border-slate-300 hover:bg-slate-50/70"
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
        <p className="truncate text-xs text-slate-500">{item.description}</p>
      </div>

      <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition group-hover:text-slate-600" />
    </Link>
  );
}
