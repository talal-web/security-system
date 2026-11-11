"use client";

import { BarChart3, Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

interface MonthlyAttendanceFiltersProps {
  month: string;
  onMonthChange: (month: string) => void;
  onExport: () => void | Promise<void>;
  isExporting?: boolean;
}

export default function MonthlyAttendanceFilters({
  month,
  onMonthChange,
  onExport,
  isExporting = false,
}: MonthlyAttendanceFiltersProps) {
  return (
    <PageHeader
      title="Monthly Attendance Report"
      description="Select a month to view attendance."
      icon={BarChart3}
      actions={
        <>
          <div className="flex items-center gap-2">
            <label
              htmlFor="month"
              className="text-xs font-medium text-slate-600"
            >
              Month
            </label>

            <input
              id="month"
              type="month"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 sm:w-auto"
            />
          </div>

          <Button onClick={onExport} disabled={isExporting}>
            <Download />
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>
        </>
      }
    />
  );
}
