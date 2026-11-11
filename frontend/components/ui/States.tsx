import * as React from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/70", className)}
      {...props}
    />
  );
}

interface StateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

/** Empty result / nothing-here-yet panel. */
export function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon = Inbox,
  action,
  className,
}: StateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="size-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Inline loading panel. */
export function LoadingState({
  title = "Loading...",
  className,
}: Pick<StateProps, "title" | "className">) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-6 py-12 text-sm text-slate-500 shadow-card",
        className,
      )}
    >
      <Loader2 className="size-4 animate-spin text-blue-600" />
      {title}
    </div>
  );
}

/** Error panel for failed queries. */
export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
}: Omit<StateProps, "icon">) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-4",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-red-800">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm text-red-700/90">{description}</p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

/** Full-screen centered loader used by route guards. */
export function FullPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-slate-500"
    >
      <Loader2 className="size-6 animate-spin text-blue-600" />
      {label}
    </div>
  );
}
