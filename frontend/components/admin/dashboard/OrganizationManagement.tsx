"use client";

import { Building2 } from "lucide-react";

import CompactLink from "@/components/admin/cards/CompactLink";
import { managementModules, toneStyles } from "@/components/admin/dashboard.config";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Card, CardHeader } from "@/components/ui/Card";

export default function OrganizationManagement() {
  const { getAreaAwareHref } = useSelectedArea();

  return (
    <Card>
      <CardHeader
        title="Organization management"
        description="People and operational structure of the company"
        icon={Building2}
      />

      <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
        {managementModules.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.title} className="bg-white p-4">
              <div className="mb-2 flex items-center gap-2.5">
                <span
                  className={`flex size-7 items-center justify-center rounded-md ${toneStyles[module.tone].icon}`}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="truncate text-xs text-slate-500">
                    {module.description}
                  </p>
                </div>
              </div>
              {module.items.map((item) => (
                <CompactLink
                  key={item.href}
                  {...item}
                  href={getAreaAwareHref(item.href)}
                />
              ))}
            </div>
          );
        })}
        {/* Filler keeps the grid's divider lines even on odd counts */}
        {managementModules.length % 2 === 1 && (
          <div className="hidden bg-white sm:block" aria-hidden />
        )}
      </div>
    </Card>
  );
}
