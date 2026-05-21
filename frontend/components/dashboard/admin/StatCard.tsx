// components/dashboard/StatCard.tsx
"use client";

import React from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>

          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4">
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
