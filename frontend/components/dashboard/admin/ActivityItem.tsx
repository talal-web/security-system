// components/dashboard/ActivityItem.tsx
"use client";

import { Clock3 } from "lucide-react";

type ActivityItemProps = {
  title: string;
  time: string;
};

export default function ActivityItem({ title, time }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-black p-2 text-white">
          <Clock3 size={16} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">{title}</p>
        </div>
      </div>

      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}
