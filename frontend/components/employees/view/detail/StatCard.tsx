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
    <div className="group h-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:rounded-2xl sm:p-4 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
            {title}
          </p>

          <div className="mt-1.5 sm:mt-2">
            {value ? (
              <h3 className="truncate text-lg font-bold text-slate-900 sm:text-lg lg:text-xl">
                {value}
              </h3>
            ) : (
              <span className="text-sm font-medium text-slate-400">
                Not Provided
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl lg:h-12 lg:w-12 ${iconBg}`}
        >
          <div className="h-4 w-4 sm:h-5 sm:w-5">{icon}</div>
        </div>
      </div>
    </div>
  );
}
