"use client";

import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Layers3,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import {
  AttendanceTodayCard,
  DashboardKpis,
} from "@/components/admin/dashboard/DashboardInsights";
import PrimaryAction from "@/components/admin/cards/PrimaryAction";
import CompactLink from "@/components/admin/cards/CompactLink";
import StatusItem from "@/components/admin/cards/StatusItem";
import { useSelectedArea } from "@/components/area/AreaContext";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageHeader";
import { useMe } from "@/hooks/auth/useMe";

import type { ActionItem } from "@/components/admin/dashboard.types";

const employeeActions: ActionItem[] = [
  {
    title: "Add Employee",
    description: "Register a new security employee.",
    href: "/employees/create",
    icon: UserPlus,
    tone: "blue",
  },
  {
    title: "View Employees",
    description: "View and manage employee records.",
    href: "/employees/view",
    icon: Users,
    tone: "slate",
  },
];

const attendanceActions: ActionItem[] = [
  {
    title: "Mark Attendance",
    description: "Record today's employee attendance.",
    href: "/attendance/session",
    icon: CheckCircle2,
    tone: "blue",
  },
  {
    title: "Daily Report",
    description: "Review today's attendance records.",
    href: "/attendance/daily",
    icon: CalendarDays,
    tone: "emerald",
  },
  {
    title: "Monthly Report",
    description: "Review monthly attendance and exports.",
    href: "/attendance/monthly",
    icon: BarChart3,
    tone: "violet",
  },
];

const locationActions: ActionItem[] = [
  {
    title: "View Locations",
    description: "View and manage employee deployment locations.",
    href: "/locations/view",
    icon: MapPin,
    tone: "blue",
  },
  {
    title: "View Sectors",
    description: "View sectors and their assigned locations.",
    href: "/sectors/view",
    icon: Building2,
    tone: "emerald",
  },
];

const quickLinks = [
  { href: "/attendance/session", label: "Attendance Session", icon: CheckCircle2 },
  { href: "/employees/create", label: "Add Employee", icon: UserPlus },
  { href: "/employees/view", label: "View Employees", icon: Users },
  { href: "/attendance/daily", label: "Daily Report", icon: CalendarDays },
  { href: "/attendance/monthly", label: "Monthly Report", icon: BarChart3 },
  { href: "/locations/view", label: "View Locations", icon: MapPin },
  { href: "/sectors/view", label: "View Sectors", icon: Layers3 },
];

const workspaceStatus = [
  "Attendance",
  "Employee Records",
  "Daily Reports",
  "Monthly Reports",
];

const headerActions = [
  {
    href: "/attendance/session",
    label: "Mark Attendance",
    icon: CheckCircle2,
    variant: "primary",
  },
  {
    href: "/employees/view",
    label: "Employees",
    icon: Users,
    variant: "secondary",
  },
] as const;

export default function ClerkDashboardPage() {
  const { data, isLoading, isError } = useMe();
  const { getAreaAwareHref } = useSelectedArea();

  const userName = data?.user?.name || "Clerk";

  return (
    <ProtectedRoute allowedRoles={["clerk"]}>
      <PageContainer>
        <DashboardHeader
          userName={userName}
          isLoading={isLoading}
          isError={isError}
          portal="Clerk Portal"
          fallbackName="Clerk"
          description="Manage employee records, attendance, and operational reports from your workspace."
          actions={headerActions}
        />

        <DashboardKpis showPayroll={false} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <DashboardSection
              title="Employee Management"
              description="Access employee records and registration tools."
              icon={Users}
              items={employeeActions}
              columns="sm:grid-cols-2"
            />

            <DashboardSection
              title="Attendance"
              description="Record attendance and review attendance reports."
              icon={CalendarDays}
              items={attendanceActions}
              columns="sm:grid-cols-2 xl:grid-cols-3"
            />

            <DashboardSection
              title="Locations & Sectors"
              description="Access deployment locations and sector information."
              icon={MapPin}
              items={locationActions}
              columns="sm:grid-cols-2"
            />
          </div>

          <aside className="space-y-4">
            <AttendanceTodayCard />

            <Card>
              <CardHeader
                title="Quick Access"
                description="Frequently used clerk tools"
                icon={ClipboardList}
              />
              <CardContent className="p-2 sm:p-2">
                {quickLinks.map((link) => (
                  <CompactLink
                    key={link.href}
                    {...link}
                    href={getAreaAwareHref(link.href)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Workspace Status"
                description="Clerk operational modules"
                icon={Activity}
              />
              <CardContent className="py-2 sm:py-2">
                {workspaceStatus.map((label) => (
                  <StatusItem key={label} label={label} status="Available" />
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

function DashboardSection({
  title,
  description,
  icon,
  items,
  columns,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  items: ActionItem[];
  columns: string;
}) {
  return (
    <Card>
      <CardHeader title={title} description={description} icon={icon} />
      <CardContent className={`grid grid-cols-1 gap-2 ${columns}`}>
        {items.map((item) => (
          <PrimaryAction key={item.title} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
