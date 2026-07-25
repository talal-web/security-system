import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  large?: boolean;
  className?: string;
}

export default function InfoCard({
  icon,
  label,
  value,
  large = false,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`group flex h-full gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-4 lg:p-5 ${className}`}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl lg:h-12 lg:w-12">
        <div className="h-4 w-4 sm:h-5 sm:w-5">{icon}</div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
          {label}
        </p>

        <div
          className={`mt-1.5 text-sm font-semibold text-slate-900 sm:mt-2 sm:text-[15px] ${
            large
              ? "wrap-break whitespace-pre-wrap leading-6 sm:leading-7"
              : "truncate"
          }`}
        >
          {value ?? (
            <span className="font-normal text-sm text-slate-400">
              Not Provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
