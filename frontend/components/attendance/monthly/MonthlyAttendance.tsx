"use client";

import { useMemo, useState } from "react";

import { useMonthlyAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import { exportMonthlyAttendanceExcel } from "@/lib/exports/exportMonthlyAttendanceExcel";

import MonthlyAttendanceFilters from "./AttendanceFilters";
import MonthlyAttendanceStats from "./AttendanceStats";
import MonthlyAttendanceTable from "./AttendanceTable";

export default function MonthlyAttendance() {
  // ======================================
  // DEFAULT MONTH (YYYY-MM)
  // ======================================

  const defaultMonth = useMemo(() => {
    return new Date().toISOString().slice(0, 7);
  }, []);

  const [month, setMonth] = useState(defaultMonth);
  const [isExporting, setIsExporting] = useState(false);

  // ======================================
  // QUERY
  // ======================================

  const { data, isLoading, isError, error, refetch } =
    useMonthlyAttendanceReport({
      month,
    });

  // ======================================
  // LOADING
  // ======================================

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">Loading monthly attendance...</p>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
        <p className="font-medium text-red-600">{error.message}</p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // ======================================
  // EMPTY
  // ======================================

  if (!data?.data) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">No attendance found.</p>
      </div>
    );
  }

  const report = data.data;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await exportMonthlyAttendanceExcel({
        month: report.month,
        overall: report.overall,
        employees: report.employees,
      });
    } catch (error) {
      console.error("Failed to export monthly attendance:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="space-y-6">
      <MonthlyAttendanceFilters
        month={month}
        onMonthChange={setMonth}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <MonthlyAttendanceStats overall={report.overall} />

      <MonthlyAttendanceTable
        month={report.month}
        employees={report.employees}
      />
    </div>
  );
}
