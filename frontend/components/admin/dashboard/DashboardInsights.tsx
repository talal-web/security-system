"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Moon,
  Sun,
  UserX,
  Users,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { SegmentedBar } from "@/components/ui/SegmentedBar";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { useSelectedArea } from "@/components/area/AreaContext";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useWorkspaceInsights } from "@/hooks/dashboard/useWorkspaceInsights";
import type { PayrollStatus } from "@/types/payroll";

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const formatCurrency = (value: number) =>
  `Rs. ${Math.round(value).toLocaleString()}`;

const payrollTone: Record<PayrollStatus, "warning" | "info" | "success"> = {
  draft: "warning",
  finalized: "info",
  paid: "success",
};

// ============================================================================
// KPI ROW
// ============================================================================

export function DashboardKpis({ showPayroll = true }: { showPayroll?: boolean }) {
  const { getAreaAwareHref } = useSelectedArea();
  const { employees, loading: employeesLoading } = useEmployees();
  const { canSeeAttendance, attendance, attendanceStats, payroll, payrollStats, month } =
    useWorkspaceInsights();

  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const present = attendanceStats?.present ?? 0;
  const marked = attendanceStats?.total ?? 0;
  const absentLeave = (attendanceStats?.absent ?? 0) + (attendanceStats?.leave ?? 0);

  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      <StatCard
        label="Active employees"
        value={activeEmployees.toLocaleString()}
        hint={`${employees.length.toLocaleString()} total in this area`}
        icon={Users}
        tone="blue"
        loading={employeesLoading}
        href={getAreaAwareHref("/employees/view")}
      />

      {canSeeAttendance && (
        <>
          <StatCard
            label="Present today"
            value={present.toLocaleString()}
            hint={marked ? `of ${marked.toLocaleString()} marked` : "Attendance not marked yet"}
            icon={CheckCircle2}
            tone="emerald"
            loading={attendance.isPending}
            href={getAreaAwareHref("/attendance/daily")}
          />
          <StatCard
            label="Absent / on leave"
            value={absentLeave.toLocaleString()}
            hint={`${attendanceStats?.absent ?? 0} absent · ${attendanceStats?.leave ?? 0} leave`}
            icon={UserX}
            tone="amber"
            loading={attendance.isPending}
            href={getAreaAwareHref("/attendance/daily")}
          />
        </>
      )}

      {showPayroll && (
        <StatCard
          label={`${MONTHS[month - 1]} payroll`}
          value={formatCurrency(payrollStats.netTotal)}
          hint={`${payrollStats.total} records · ${payrollStats.paid} paid`}
          icon={WalletCards}
          tone="violet"
          loading={payroll.isPending}
          href={getAreaAwareHref("/payroll")}
        />
      )}
    </section>
  );
}

// ============================================================================
// TODAY'S ATTENDANCE
// ============================================================================

export function AttendanceTodayCard() {
  const { getAreaAwareHref } = useSelectedArea();
  const { attendance, attendanceStats } = useWorkspaceInsights();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <Card>
      <CardHeader
        title="Today's attendance"
        description={today}
        icon={CalendarCheck2}
        actions={
          <ButtonLink
            href={getAreaAwareHref("/attendance/session")}
            variant="secondary"
            size="sm"
          >
            Mark attendance
          </ButtonLink>
        }
      />
      <CardContent>
        {attendance.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : attendance.isError ? (
          <ErrorState
            title="Couldn't load today's attendance"
            description={attendance.error.message}
          />
        ) : (
          <>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {attendanceStats?.total
                  ? `${Math.round(((attendanceStats.present ?? 0) / attendanceStats.total) * 100)}%`
                  : "—"}
              </span>
              <span className="text-sm text-slate-500">present rate</span>
            </div>

            <SegmentedBar
              emptyLabel="No attendance has been submitted for today yet."
              segments={[
                { label: "Present", value: attendanceStats?.present ?? 0, color: "bg-emerald-500" },
                { label: "Leave", value: attendanceStats?.leave ?? 0, color: "bg-amber-400" },
                { label: "Absent", value: attendanceStats?.absent ?? 0, color: "bg-red-500" },
              ]}
            />

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Sun className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">Day shift</p>
                  <p className="text-sm font-semibold tabular-nums text-slate-900">
                    {attendanceStats?.day ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Moon className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">Night shift</p>
                  <p className="text-sm font-semibold tabular-nums text-slate-900">
                    {attendanceStats?.night ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PAYROLL STATUS
// ============================================================================

export function PayrollStatusCard() {
  const { getAreaAwareHref } = useSelectedArea();
  const { payroll, payrollStats, month, year } = useWorkspaceInsights();

  return (
    <Card>
      <CardHeader
        title="Payroll progress"
        description={`${MONTHS[month - 1]} ${year}`}
        icon={WalletCards}
        actions={
          <ButtonLink href={getAreaAwareHref("/payroll")} variant="secondary" size="sm">
            Open payroll
          </ButtonLink>
        }
      />
      <CardContent>
        {payroll.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : payroll.isError ? (
          <ErrorState title="Couldn't load payroll" description={payroll.error.message} />
        ) : (
          <>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {formatCurrency(payrollStats.paidTotal)}
              </span>
              <span className="text-sm text-slate-500">
                paid of {formatCurrency(payrollStats.netTotal)}
              </span>
            </div>

            <SegmentedBar
              emptyLabel="No payroll has been generated for this month yet."
              segments={[
                { label: "Draft", value: payrollStats.draft, color: "bg-amber-400" },
                { label: "Finalized", value: payrollStats.finalized, color: "bg-blue-500" },
                { label: "Paid", value: payrollStats.paid, color: "bg-emerald-500" },
              ]}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RECENT PAYROLL ACTIVITY
// ============================================================================

export function RecentPayrollActivity() {
  const { getAreaAwareHref } = useSelectedArea();
  const { payroll, payrolls } = useWorkspaceInsights();

  const recent = [...payrolls]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Recent payroll activity"
        description="Latest updates this month"
        actions={
          <Link
            href={getAreaAwareHref("/payroll")}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      {payroll.isPending ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : payroll.isError ? (
        <div className="p-5">
          <ErrorState title="Couldn't load activity" description={payroll.error.message} />
        </div>
      ) : recent.length === 0 ? (
        <div className="p-5">
          <EmptyState
            title="No payroll activity yet"
            description="Generated payrolls for this month will appear here."
            icon={WalletCards}
            className="border-0 py-8"
          />
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {recent.map((item) => {
            const employee = typeof item.employee === "string" ? null : item.employee;
            return (
              <li key={item._id}>
                <Link
                  href={getAreaAwareHref(`/payroll/${item._id}`)}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50/80 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {employee?.name ?? "Employee"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {employee?.empId ? `${employee.empId} · ` : ""}
                      Updated{" "}
                      {new Date(item.updatedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <Badge tone={payrollTone[item.status]} dot className="capitalize">
                    {item.status}
                  </Badge>
                  <span className="hidden w-28 text-right text-sm font-medium tabular-nums text-slate-900 sm:block">
                    {formatCurrency(item.netSalary)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
