import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { DashboardSidebarLink } from "@/components/admin/dashboard.types";

/** Single-line navigation row used inside dashboard cards. */
export default function CompactLink({ href, label, icon: Icon }: DashboardSidebarLink) {
  return (
    <Link
      href={href}
      className="group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
    >
      <Icon className="size-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRight className="size-3.5 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
    </Link>
  );
}
