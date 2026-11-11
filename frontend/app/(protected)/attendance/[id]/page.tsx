"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Edit3, UserRound } from "lucide-react";

import AttendanceDetail from "@/components/attendance/AttendanceDetail";
import AttendanceEditForm from "@/components/attendance/AttendanceEditForm";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { ErrorState, Skeleton } from "@/components/ui/States";
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
      <PageContainer className="max-w-6xl">
        <ErrorState
          title="Unable to load attendance"
          description={
            error instanceof Error
              ? error.message
              : "The attendance record could not be found or may have been removed."
          }
          action={
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft />
              Go Back
            </Button>
          }
        />
      </PageContainer>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Edit Mode                                                              */
  /* ---------------------------------------------------------------------- */

  if (isEditing && canEdit) {
    return (
      <PageContainer className="max-w-6xl">
        <PageHeader
          title="Edit Attendance"
          description={`${attendance.employeeSnapshot.name} • ${attendance.employeeSnapshot.empId}`}
          icon={Edit3}
          actions={
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              <ArrowLeft />
              Cancel
            </Button>
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
      </PageContainer>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Detail View                                                            */
  /* ---------------------------------------------------------------------- */

  return (
    <PageContainer className="max-w-6xl">
      <PageHeader
        title="Attendance Details"
        description={
          <>
            <span className="font-medium text-slate-700">
              {attendance.employeeSnapshot.name}
            </span>
            <span className="mx-1.5 text-slate-300">•</span>
            {attendance.employeeSnapshot.empId}
            <span className="mx-1.5 text-slate-300">•</span>
            {attendance.employeeSnapshot.designation}
          </>
        }
        icon={UserRound}
        actions={
          <>
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft />
              Back
            </Button>

            {canEdit && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 />
                Edit Attendance
              </Button>
            )}
          </>
        }
      />

      {/* Quick Summary */}
      <Card className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            <CalendarDays className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Status</p>

            <div className="mt-1">
              <AttendanceStatusBadge status={attendance.status} />
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Detail                                                              */}
      {/* ------------------------------------------------------------------ */}

      <AttendanceDetail attendance={attendance} />
    </PageContainer>
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
    <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p
          className="mt-0.5 truncate text-sm font-semibold text-slate-900"
          title={value}
        >
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
    <PageContainer className="max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      <Card className="grid gap-px overflow-hidden sm:grid-cols-3">
        <div className="p-4">
          <Skeleton className="h-8" />
        </div>
        <div className="p-4">
          <Skeleton className="h-8" />
        </div>
        <div className="p-4">
          <Skeleton className="h-8" />
        </div>
      </Card>

      <div className="space-y-5">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    </PageContainer>
  );
}

function SkeletonSection() {
  return (
    <Card className="p-5">
      <Skeleton className="mb-5 h-5 w-40" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </Card>
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
