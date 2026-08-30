import React from "react";

interface StatCardProps {
  title: string;
  value?: React.ReactNode;
  icon: React.ReactNode;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-slate-900",
}: StatCardProps) {
  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <div className="mt-1">
            {value ? (
              <h3 className="truncate text-base font-semibold text-slate-900">
                {value}
              </h3>
            ) : (
              <span className="text-sm font-medium text-slate-400">
                Not provided
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <div className="h-4 w-4">{icon}</div>
        </div>
      </div>
    </div>
  );
}
