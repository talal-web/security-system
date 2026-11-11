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
  iconBg = "bg-slate-100 text-slate-600",
}: StatCardProps) {
  return (
    <div className="h-full min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-card sm:p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <div className="mt-1">
            {value ? (
              <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
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
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4 ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
