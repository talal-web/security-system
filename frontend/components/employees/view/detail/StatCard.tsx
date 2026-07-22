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
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {value ?? (
              <span className="text-base font-medium text-slate-400">
                Not Provided
              </span>
            )}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
