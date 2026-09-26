import Link from "next/link";

import { ArrowRight } from "lucide-react";

import type { DashboardSidebarLink } from "@/components/admin/dashboard.types";

export default function CompactLink({
  href,
  label,
  icon: Icon,
}: DashboardSidebarLink) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg border border-slate-100 px-2.5 py-2 transition hover:border-slate-200 hover:bg-slate-50"
    >
      <Icon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-600" />

      <span className="flex-1 truncate text-[11px] font-medium text-slate-600 group-hover:text-slate-900">
        {label}
      </span>

      <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </Link>
  );
}
