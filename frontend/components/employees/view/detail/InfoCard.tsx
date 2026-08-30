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
      className={`flex h-full gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${className}`}
    >
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <div className="h-4 w-4">{icon}</div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
          {label}
        </p>

        <div
          className={`mt-1.5 text-sm font-semibold text-slate-900 sm:mt-2 sm:text-[15px] ${
            large ? "whitespace-pre-wrap leading-6" : "truncate"
          }`}
        >
          {value ?? (
            <span className="font-normal text-sm text-slate-400">
              Not provided
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
