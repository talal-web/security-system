"use client";

import Link from "next/link";
import { Popover } from "radix-ui";
import {
  Bell,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSelectedArea } from "@/components/area/AreaContext";
import { useMe } from "@/hooks/auth/useMe";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/notifications/useNotifications";
import { useWorkspaceInsights } from "@/hooks/dashboard/useWorkspaceInsights";
import type { AppNotification } from "@/types/notification";

type Notice = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  tone: "amber" | "blue";
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const timeAgo = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

/**
 * Two sources:
 * - Activity from the server (invoice issued / paid), read state per user.
 * - Live workspace data (attendance missing, payroll awaiting action).
 */
export default function NotificationsMenu() {
  const { getAreaAwareHref, selectedArea } = useSelectedArea();
  const { canSeeAttendance, attendance, attendanceStats, payroll, payrollStats, month } =
    useWorkspaceInsights();

  const role = useMe().data?.user?.role;
  const hasActivityFeed = role === "admin" || role === "developer";
  const activity = useNotifications(hasActivityFeed);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const activityItems: AppNotification[] = activity.data?.items ?? [];
  const activityUnread = activity.data?.unreadCount ?? 0;

  const notices: Notice[] = [];

  if (canSeeAttendance && attendance.isSuccess && (attendanceStats?.total ?? 0) === 0) {
    notices.push({
      id: "attendance",
      title: "Attendance not recorded today",
      description: `No attendance has been submitted for ${selectedArea?.name ?? "this area"} yet.`,
      href: "/attendance/session",
      icon: CalendarClock,
      tone: "amber",
    });
  }

  if (payroll.isSuccess && payrollStats.draft > 0) {
    notices.push({
      id: "payroll-draft",
      title: `${payrollStats.draft} draft payroll${payrollStats.draft === 1 ? "" : "s"}`,
      description: `${MONTHS[month - 1]} payroll is waiting to be reviewed and finalized.`,
      href: "/payroll",
      icon: WalletCards,
      tone: "blue",
    });
  }

  if (payroll.isSuccess && payrollStats.finalized > 0) {
    notices.push({
      id: "payroll-finalized",
      title: `${payrollStats.finalized} payroll${payrollStats.finalized === 1 ? "" : "s"} ready to pay`,
      description: `Finalized ${MONTHS[month - 1]} salaries not yet marked as paid.`,
      href: "/payroll",
      icon: WalletCards,
      tone: "blue",
    });
  }

  const count = notices.length + activityUnread;
  const isEmpty = notices.length === 0 && activityItems.length === 0;

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={count ? `Notifications (${count})` : "Notifications"}
        className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100"
      >
        <Bell className="size-[18px]" />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white ring-2 ring-white">
            {count}
          </span>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[60] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {activityUnread > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                Mark all read
              </button>
            ) : count > 0 ? (
              <span className="text-xs text-slate-500">{count} pending</span>
            ) : null}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCheck className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">
                You&apos;re all caught up
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Nothing needs your attention right now.
              </p>
            </div>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
              {activityItems.map((item) => {
                const Icon = item.type === "invoice.paid" ? CheckCircle2 : ReceiptText;
                return (
                  <li key={item._id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!item.isRead) markRead.mutate(item._id);
                      }}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50",
                        !item.isRead && "bg-blue-50/40",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          item.type === "invoice.paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-blue-50 text-blue-600",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          {item.title}
                          {!item.isRead && (
                            <span className="size-1.5 rounded-full bg-blue-500" aria-label="Unread" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {item.message}
                        </span>
                        <span className="mt-1 block text-[11px] text-slate-400">
                          {timeAgo(item.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}

              {notices.map((notice) => {
                const Icon = notice.icon;
                return (
                  <li key={notice.id}>
                    <Popover.Close asChild>
                      <Link
                        href={getAreaAwareHref(notice.href)}
                        className="flex gap-3 px-4 py-3 transition hover:bg-slate-50"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                            notice.tone === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-900">
                            {notice.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {notice.description}
                          </span>
                        </span>
                      </Link>
                    </Popover.Close>
                  </li>
                );
              })}
            </ul>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
