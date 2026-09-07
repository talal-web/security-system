"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Edit3, UserRound } from "lucide-react";

import AttendanceDetail from "@/components/attendance/AttendanceDetail";
import AttendanceEditForm from "@/components/attendance/AttendanceEditForm";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatusBadge";
import { useAttendanceById } from "@/hooks/attendance/useAttendance";
import { useMe } from "@/hooks/auth/useMe";

export default function AttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params.id === "string" ? params.id : "";

  const { data: attendance, isLoading, isError, error } = useAttendanceById(id);

  const { data: me, isLoading: isLoadingMe } = useMe();

  const [isEditing, setIsEditing] = useState(false);

  const role = me?.user?.role;

  // Developer, admin and clerk can edit attendance.
  const canEdit = role === "developer" || role === "admin" || role === "clerk";

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading || isLoadingMe) {
    return <AttendancePageSkeleton />;
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (isError || !attendance) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border bg-card px-6 py-12 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <CalendarDays className="size-5" />
          </div>

          <h1 className="mt-4 text-base font-semibold">
            Unable to load attendance
          </h1>

          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "The attendance record could not be found or may have been removed."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border/70 bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Edit Mode                                                              */
  /* ---------------------------------------------------------------------- */

  if (isEditing && canEdit) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Edit Attendance"
          description={`${attendance.employeeSnapshot.name} • ${attendance.employeeSnapshot.empId}`}
          icon={Edit3}
          action={
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <ArrowLeft className="size-4" />
              Cancel
            </button>
          }
        />

        {/* Edit Form */}
        <AttendanceEditForm
          attendance={attendance}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Detail View                                                            */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          {/* Identity */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                  Attendance Details
                </h1>

                <span className="hidden text-muted-foreground sm:inline">
                  /
                </span>

                <span className="truncate text-sm text-muted-foreground">
                  {attendance.employeeSnapshot.name}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="font-medium">
                  {attendance.employeeSnapshot.empId}
                </span>

                <span>•</span>

                <span>{attendance.employeeSnapshot.designation}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border/70 bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <Edit3 className="size-4" />
                Edit Attendance
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid border-t sm:grid-cols-3">
          <SummaryItem
            label="Employee"
            value={attendance.employeeSnapshot.name}
            icon={UserRound}
          />

          <SummaryItem
            label="Date"
            value={formatDate(attendance.date)}
            icon={CalendarDays}
          />

          <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="size-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <div className="mt-1">
                <AttendanceStatusBadge status={attendance.status} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Detail                                                              */}
      {/* ------------------------------------------------------------------ */}

      <AttendanceDetail attendance={attendance} />
    </div>
  );
}

/* ========================================================================== */
/* Page Header                                                                */
/* ========================================================================== */

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action?: React.ReactNode;
}

function PageHeader({
  title,
  description,
  icon: Icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h1>

          <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

/* ========================================================================== */
/* Summary Item                                                               */
/* ========================================================================== */

interface SummaryItemProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

function SummaryItem({ label, value, icon: Icon }: SummaryItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b px-4 py-3 sm:border-b-0 sm:border-r sm:px-5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold" title={value}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Loading Skeleton                                                           */
/* ========================================================================== */

function AttendancePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="animate-pulse overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/5" />

            <div className="space-y-2">
              <div className="h-5 w-44 rounded bg-primary/5" />
              <div className="h-3 w-32 rounded bg-primary/5" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-10 w-20 rounded-lg bg-primary/5" />
            <div className="h-10 w-36 rounded-lg bg-primary/5" />
          </div>
        </div>

        <div className="grid border-t sm:grid-cols-3">
          <div className="h-16 border-b bg-primary/5 sm:border-b-0 sm:border-r" />
          <div className="h-16 border-b bg-primary/5 sm:border-b-0 sm:border-r" />
          <div className="h-16 bg-primary/5" />
        </div>
      </div>

      <div className="space-y-5">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="animate-pulse rounded-lg border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-5 h-5 w-40 rounded bg-primary/5" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-12 rounded-lg bg-primary/5" />
        <div className="h-12 rounded-lg bg-primary/5" />
        <div className="h-12 rounded-lg bg-primary/5" />
        <div className="h-12 rounded-lg bg-primary/5" />
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

function formatDate(value?: string) {
  if (!value) return "—";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
