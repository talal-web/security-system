// components/dashboard/supervisor/IncidentItem.tsx
"use client";

import { AlertTriangle } from "lucide-react";

type IncidentItemProps = {
  title: string;
  time: string;
};

export default function IncidentItem({ title, time }: IncidentItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-100 p-2 text-red-600">
          <AlertTriangle size={16} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
        </div>
      </div>

      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}
