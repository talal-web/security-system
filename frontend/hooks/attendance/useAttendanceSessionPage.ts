"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
} from "@/hooks/attendance/useAttendanceSession";

import type {
  AttendanceFormEmployee,
  AttendanceFormSector,
} from "@/types/attendance-session";

export function useAttendanceSessionPage() {
  // ======================================
  // API
  // ======================================

  const { data, isLoading, error } = useAttendanceSession();

  const markAttendanceMutation = useMarkAttendanceSession();

  // ======================================
  // STATE
  // ======================================

  const [date, setDate] = useState("");

  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "leave"
  >("all");

  const [sectors, setSectors] = useState<AttendanceFormSector[]>([]);

  const [selectedEmployees, setSelectedEmployees] = useState<
    Record<string, boolean>
  >({});

  // ======================================
  // DATE
  // ======================================

  const defaultDate = useMemo(
    () =>
      data?.attendanceDate.split("T")[0] ??
      new Date().toISOString().split("T")[0],
    [data?.attendanceDate],
  );

  const dateValue = date || defaultDate;

  // ======================================
  // INITIALIZE FORM
  // ======================================

  useEffect(() => {
    if (!data?.sectors) return;

    setSectors(
      data.sectors.map((sector) => ({
        ...sector,

        locations: Array.isArray(sector.locations) ? sector.locations : [],

        employees: Array.isArray(sector.employees)
          ? sector.employees.map((emp) => ({
              ...emp,

              selectedLocation: emp.currentLocation?._id ?? null,

              status: "present",

              shift: emp.defaultShift ?? null,

              remarks: "",
            }))
          : [],
      })),
    );

    setSelectedEmployees({});
  }, [data]);

  // ======================================
  // ALL EMPLOYEES
  // ======================================

  const allEmployees = useMemo(
    () => sectors.flatMap((sector) => sector.employees),
    [sectors],
  );

  // ======================================
  // DASHBOARD STATS
  // ======================================

  const stats = useMemo(
    () => ({
      total: allEmployees.length,

      present: allEmployees.filter((e) => e.status === "present").length,

      absent: allEmployees.filter((e) => e.status === "absent").length,

      leave: allEmployees.filter((e) => e.status === "leave").length,
    }),
    [allEmployees],
  );

  // ======================================
  // SELECTION
  // ======================================

  const selectedCount = useMemo(
    () => Object.values(selectedEmployees).filter(Boolean).length,
    [selectedEmployees],
  );

  // ======================================
  // SEARCHED EMPLOYEES
  // ======================================

  const searchedEmployees = useMemo(() => {
    return allEmployees.filter((emp) => {
      const matchesQuery = [
        emp.name,
        emp.empId,
        emp.fatherName,
        emp.designation,
        emp.currentLocation?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : emp.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [allEmployees, query, statusFilter]);

  // ======================================
  // PRESENT SECTORS
  // ======================================

  const presentSectors = useMemo(() => {
    return sectors
      .map((sector) => ({
        ...sector,

        employees: sector.employees.filter((emp) => {
          if (emp.status !== "present") return false;

          if (
            query &&
            ![emp.name, emp.empId, emp.designation, emp.currentLocation?.name]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            return false;
          }

          if (statusFilter !== "all" && statusFilter !== "present") {
            return false;
          }

          return true;
        }),
      }))
      .filter((sector) => sector.employees.length > 0);
  }, [sectors, query, statusFilter]);

  // ======================================
  // ABSENT EMPLOYEES
  // ======================================

  const absentEmployees = useMemo(() => {
    return searchedEmployees.filter((emp) => emp.status === "absent");
  }, [searchedEmployees]);

  // ======================================
  // LEAVE EMPLOYEES
  // ======================================

  const leaveEmployees = useMemo(() => {
    return searchedEmployees.filter((emp) => emp.status === "leave");
  }, [searchedEmployees]);

  // ======================================
  // VISIBLE EMPLOYEES
  // ======================================

  const visibleEmployeeCount = useMemo(
    () =>
      presentSectors.reduce(
        (count, sector) => count + sector.employees.length,
        0,
      ) +
      absentEmployees.length +
      leaveEmployees.length,
    [presentSectors, absentEmployees, leaveEmployees],
  );
  // ======================================
  // EMPLOYEE UPDATE
  // ======================================

  const handleEmployeeChange = (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => {
    setSectors((prev) =>
      prev.map((sector) => ({
        ...sector,
        employees: sector.employees.map((emp) => {
          if (emp.employeeId !== employeeId) {
            return emp;
          }

          // Status changed
          if (field === "status") {
            const status = value as AttendanceFormEmployee["status"];

            // Present
            if (status === "present") {
              return {
                ...emp,
                status,
                shift: emp.defaultShift ?? null,
                selectedLocation:
                  emp.selectedLocation ?? emp.currentLocation?._id ?? null,
              };
            }

            // Absent / Leave
            return {
              ...emp,
              status,
              shift: null,
              selectedLocation: null,
            };
          }

          return {
            ...emp,
            [field]: value,
          };
        }),
      })),
    );
  };

  // ======================================
  // BULK STATUS UPDATE
  // ======================================

  const handleBulkUpdateStatus = (status: "present" | "absent" | "leave") => {
    if (selectedCount === 0) {
      toast.error("No employees selected.");
      return;
    }

    setSectors((prev) =>
      prev.map((sector) => ({
        ...sector,
        employees: sector.employees.map((emp) => {
          if (!selectedEmployees[emp.employeeId]) {
            return emp;
          }

          if (status === "present") {
            return {
              ...emp,
              status,
              shift: emp.defaultShift ?? null,
              selectedLocation:
                emp.selectedLocation ?? emp.currentLocation?._id ?? null,
            };
          }

          return {
            ...emp,
            status,
            shift: null,
            selectedLocation: null,
          };
        }),
      })),
    );

    const selectedCountText =
      Object.values(selectedEmployees).filter(Boolean).length;

    toast.success(
      `${selectedCountText} employee${
        selectedCountText > 1 ? "s" : ""
      } marked as ${status}.`,
    );
  };

  // ======================================
  // SELECTION
  // ======================================

  const toggleEmployeeSelection = (employeeId: string, checked: boolean) => {
    setSelectedEmployees((prev) => {
      const next = { ...prev };

      if (checked) {
        next[employeeId] = true;
      } else {
        delete next[employeeId];
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedEmployees({});

    toast.success("Selection cleared.");
  };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = async () => {
    try {
      const invalidEmployee = allEmployees.find(
        (emp) =>
          emp.status === "present" && (!emp.selectedLocation || !emp.shift),
      );

      if (invalidEmployee) {
        toast.error(
          `${invalidEmployee.name} must have both a location and a shift.`,
        );
        return;
      }

      await markAttendanceMutation.mutateAsync({
        date: dateValue,

        employees: allEmployees.map((emp) => ({
          employeeId: emp.employeeId,

          locationId: emp.status === "present" ? emp.selectedLocation : null,

          shift: emp.status === "present" ? emp.shift : null,

          status: emp.status,

          remarks: emp.remarks.trim(),
        })),
      });

      toast.success(
        data?.alreadyMarked
          ? "Attendance updated successfully."
          : "Attendance marked successfully.",
      );

      setSelectedEmployees({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit attendance.",
      );
    }
  };

  // ======================================
  // RETURN
  // ======================================

  return {
    data,
    isLoading,
    error,

    // Date
    dateValue,
    setDate,

    // Filters
    query,
    setQuery,

    statusFilter,
    setStatusFilter,

    // Stats
    stats,

    // Data
    sectors,
    presentSectors,
    absentEmployees,
    leaveEmployees,

    visibleEmployeeCount,

    // Selection
    selectedEmployees,
    setSelectedEmployees,
    selectedCount,

    toggleEmployeeSelection,
    clearSelection,

    // Mutation
    markAttendanceMutation,

    // Actions
    handleEmployeeChange,
    handleBulkUpdateStatus,
    handleSubmit,
  };
}
