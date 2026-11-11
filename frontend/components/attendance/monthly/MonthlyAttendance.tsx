"use client";

import { useMemo, useState } from "react";

import { useMonthlyAttendanceReport } from "@/hooks/attendance/useAttendanceReport";
import { exportMonthlyAttendanceExcel } from "@/lib/exports/exportMonthlyAttendanceExcel";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

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
      <PageContainer>
        <LoadingState title="Loading monthly attendance..." />
      </PageContainer>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (isError) {
    return (
      <PageContainer>
        <ErrorState
          description={error.message}
          action={
            <Button variant="danger-soft" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  // ======================================
  // EMPTY
  // ======================================

  if (!data?.data) {
    return (
      <PageContainer>
        <EmptyState title="No attendance found." />
      </PageContainer>
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
    <PageContainer>
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
    </PageContainer>
  );
}
