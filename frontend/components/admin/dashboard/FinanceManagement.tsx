"use client";

import Link from "next/link";
import { ChevronRight, WalletCards } from "lucide-react";

import { financeModules, toneStyles } from "@/components/admin/dashboard.config";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Card, CardHeader } from "@/components/ui/Card";

export default function FinanceManagement() {
  const { getAreaAwareHref } = useSelectedArea();

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Payroll & finance"
        description="Financial transactions and salary adjustments"
        icon={WalletCards}
      />

      <ul className="divide-y divide-slate-100">
        {financeModules.map((module) => {
          const Icon = module.icon;
          return (
            <li key={module.title}>
              <Link
                href={getAreaAwareHref(module.href)}
                className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50/80 sm:px-5"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${toneStyles[module.tone].icon}`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {module.title}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {module.description}
                  </span>
                </span>
                <span className="hidden text-xs font-medium text-slate-500 group-hover:text-blue-600 sm:block">
                  {module.label}
                </span>
                <ChevronRight className="size-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
