"use client";

import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  Compass,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import { DashboardKpis } from "@/components/admin/dashboard/DashboardInsights";
import PrimaryAction from "@/components/admin/cards/PrimaryAction";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageHeader";
import { useMe } from "@/hooks/auth/useMe";

import type { ActionItem } from "@/components/admin/dashboard.types";

const actions: ActionItem[] = [
  {
    title: "View Employees",
    description: "View security personnel and employee information.",
    href: "/employees/view",
    icon: Users,
    tone: "blue",
  },
  {
    title: "View Locations",
    description: "View deployment locations and assigned sectors.",
    href: "/locations/view",
    icon: MapPin,
    tone: "emerald",
  },
  {
    title: "View Sectors",
    description: "Browse available sectors and their locations.",
    href: "/sectors/view",
    icon: Building2,
    tone: "violet",
  },
  {
    title: "Attendance Session",
    description: "View the current attendance session and assignments.",
    href: "/attendance/session",
    icon: CalendarCheck2,
    tone: "amber",
  },
];

const headerActions = [
  {
    href: "/attendance/session",
    label: "Attendance Session",
    icon: ArrowRight,
    variant: "primary",
  },
] as const;

export default function SupervisorDashboardPage() {
  const { data, isLoading, isError } = useMe();

  const userName = data?.user?.name || "Supervisor";

  return (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <PageContainer>
        <DashboardHeader
          userName={userName}
          isLoading={isLoading}
          isError={isError}
          portal="Supervisor Dashboard"
          fallbackName="Supervisor"
          description="Access employee information, deployment locations, sectors, and attendance operations."
          actions={headerActions}
        />

        <DashboardKpis />

        <Card>
          <CardHeader
            title="Supervisor Access"
            description="Quick access to the information and operations available to supervisors."
            icon={Compass}
          />
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {actions.map((action) => (
              <PrimaryAction key={action.href} item={action} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Supervisor Permissions
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your account provides access to operational information such
                as employees, deployment locations, sectors, and attendance
                sessions. Administrative management and data modification
                features are restricted to authorized roles.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </ProtectedRoute>
  );
}
