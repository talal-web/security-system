"use client";

import { Activity, CalendarDays, UserPlus, WalletCards } from "lucide-react";

import CompactLink from "@/components/admin/cards/CompactLink";
import StatusItem from "@/components/admin/cards/StatusItem";
import {
  attendanceLinks,
  payrollLinks,
  quickAdminLinks,
  systemStatus,
} from "@/components/admin/dashboard.config";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { DashboardSidebarLink } from "@/components/admin/dashboard.types";

function LinkCard({
  title,
  description,
  icon,
  links,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  links: DashboardSidebarLink[];
}) {
  const { getAreaAwareHref } = useSelectedArea();

  return (
    <Card>
      <CardHeader title={title} description={description} icon={icon} />
      <CardContent className="p-2 sm:p-2">
        {links.map((link) => (
          <CompactLink key={link.label} {...link} href={getAreaAwareHref(link.href)} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="space-y-4">
      <LinkCard
        title="Attendance"
        description="Operations & reporting"
        icon={CalendarDays}
        links={attendanceLinks}
      />

      <LinkCard
        title="Payroll & finance"
        description="Salary-related operations"
        icon={WalletCards}
        links={payrollLinks}
      />

      <LinkCard
        title="Quick admin"
        description="Common creation actions"
        icon={UserPlus}
        links={quickAdminLinks}
      />

      <Card>
        <CardHeader
          title="System status"
          description="Core platform services"
          icon={Activity}
        />
        <CardContent className="py-2 sm:py-2">
          {systemStatus.map((label) => (
            <StatusItem key={label} label={label} />
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
