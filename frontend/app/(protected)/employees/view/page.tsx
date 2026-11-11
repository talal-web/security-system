"use client";

import { useState } from "react";
import { Plus, Filter, Download, Users, Loader2 } from "lucide-react";

import EmployeeCard from "@/components/employees/view/EmployeeCard";
import EmployeeFilters from "@/components/employees/EmployeeFilters";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { PageContainer, PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { cn } from "@/lib/utils";

import { useEmployeeDirectory } from "@/hooks/employee/useEmployeeDirectory";
import { useSelectedArea } from "@/components/area/AreaContext";
import { exportEmployeesDirectory } from "@/utils/export/employee/allEmployeeExport/EmployeesDirectory";

export default function EmployeesPage() {
  const [exporting, setExporting] = useState(false);
  const { getAreaAwareHref } = useSelectedArea();

  const {
    filters,
    showFilters,

    employees,
    loading,
    isFetching,
    error,

    employeeCount,
    activeFilterCount,

    toggleFilters,
    handleFilterChange,
    handleClearFilters,
  } = useEmployeeDirectory();

  const handleExport = async () => {
    if (exporting || employees.length === 0) return;

    try {
      setExporting(true);
      await exportEmployeesDirectory({ employees });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState title="Loading employees..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState title="Could not load employees" description={error} />
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        {/* ================= HEADER ================= */}
        <PageHeader
          title="Employees"
          icon={Users}
          meta={
            <>
              <Badge tone="neutral">
                {employeeCount}
                <span className="hidden sm:inline">Employees</span>
              </Badge>

              <Badge tone={activeFilterCount > 0 ? "info" : "neutral"}>
                {activeFilterCount} Filter{activeFilterCount !== 1 ? "s" : ""}
              </Badge>

              <Badge tone={isFetching ? "warning" : "success"} dot>
                {isFetching ? "Searching..." : "Live"}
              </Badge>
            </>
          }
          actions={
            <>
              {/* FILTER */}
              <Button
                variant="secondary"
                onClick={toggleFilters}
                title="Filters"
                aria-label="Filters"
                aria-pressed={showFilters}
                className={cn(
                  showFilters &&
                    "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                <Filter />
                Filters
                {activeFilterCount > 0 && (
                  <Badge tone="info" className="px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {/* EXPORT */}
              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={exporting || employees.length === 0}
                title="Export Employees"
                aria-label="Export Employees"
                className="hidden sm:inline-flex"
              >
                <Download className={exporting ? "animate-bounce" : ""} />
                {exporting ? "Exporting..." : "Export"}
              </Button>

              {/* ADD EMPLOYEE */}
              <ButtonLink
                href={getAreaAwareHref("/employees/create")}
                title="Add Employee"
                aria-label="Add Employee"
              >
                <Plus />
                Add Employee
              </ButtonLink>
            </>
          }
        />

        {/* ================= FILTER PANEL ================= */}
        {showFilters && (
          <Card>
            <CardContent>
              <EmployeeFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </CardContent>
          </Card>
        )}

        {/* ================= EMPLOYEE LIST ================= */}
        <div className="relative">
          {/* Loading Overlay */}
          {isFetching && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/50">
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-pop">
                <Loader2 className="size-4 animate-spin text-blue-600" />

                <span className="text-sm font-medium text-slate-700">
                  Updating employees...
                </span>
              </div>
            </div>
          )}

          {employees.length > 0 ? (
            <>
              {/* Employee Cards */}
              <div
                className={cn(
                  "grid grid-cols-1 gap-3 transition-opacity duration-200 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4",
                  isFetching ? "pointer-events-none opacity-60" : "opacity-100",
                )}
              >
                {employees.map((employee) => (
                  <EmployeeCard key={employee._id} employee={employee} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Users}
              title="No employees found"
              description={
                activeFilterCount > 0
                  ? "Try adjusting or clearing the current filters."
                  : "Create your first employee to get started."
              }
              action={
                activeFilterCount > 0 && (
                  <Button variant="secondary" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                )
              }
            />
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}
