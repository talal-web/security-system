"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
} from "@/hooks/attendance/useAttendanceSession";

import {
  AttendanceFormEmployee,
  AttendanceFormSector,
  MarkAttendanceSessionPayload,
} from "@/types/attendance-session";

export function useAttendanceSessionPage() {
  const { data, isLoading, error } = useAttendanceSession();

  const markAttendanceMutation = useMarkAttendanceSession();

  const [date, setDate] = useState("");

  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "leave"
  >("all");

  const [sectors, setSectors] = useState<AttendanceFormSector[]>([]);

  const [selectedEmployees, setSelectedEmployees] = useState<
    Record<string, boolean>
  >({});

  const defaultDate = useMemo(
    () =>
      data?.attendanceDate.split("T")[0] ??
      new Date().toISOString().split("T")[0],
    [data?.attendanceDate],
  );

  const dateValue = date || defaultDate;

  useEffect(() => {
    if (!data?.sectors) return;

    setSectors(
      data.sectors.map((sector) => ({
        ...sector,
        employees: sector.employees.map((emp) => ({
          ...emp,
          selectedLocation: emp.currentLocation?._id ?? null,
          status: "present",
          shift: "day",
          remarks: "",
        })),
      })),
    );
  }, [data]);

  const allEmployees = useMemo(
    () => sectors.flatMap((sector) => sector.employees),
    [sectors],
  );

  const stats = useMemo(
    () => ({
      total: allEmployees.length,
      present: allEmployees.filter((e) => e.status === "present").length,
      absent: allEmployees.filter((e) => e.status === "absent").length,
      leave: allEmployees.filter((e) => e.status === "leave").length,
    }),
    [allEmployees],
  );

  const selectedCount = useMemo(
    () => Object.values(selectedEmployees).filter(Boolean).length,
    [selectedEmployees],
  );

  const filteredSectors = useMemo(
    () =>
      sectors
        .map((sector) => ({
          ...sector,
          employees: sector.employees.filter((emp) => {
            const matchesQuery = [
              emp.name,
              emp.empId,
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
          }),
        }))
        .filter((sector) => sector.employees.length > 0),
    [query, sectors, statusFilter],
  );

  const visibleEmployeeCount = useMemo(
    () =>
      filteredSectors.reduce(
        (count, sector) => count + sector.employees.length,
        0,
      ),
    [filteredSectors],
  );

  const handleEmployeeChange = (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => {
    setSectors((prev) =>
      prev.map((sector) => ({
        ...sector,
        employees: sector.employees.map((emp) =>
          emp.employeeId === employeeId ? { ...emp, [field]: value } : emp,
        ),
      })),
    );
  };

  const handleBulkUpdateStatus = (status: "present" | "absent" | "leave") => {
    setSectors((prev) =>
      prev.map((sector) => ({
        ...sector,
        employees: sector.employees.map((emp) =>
          selectedEmployees[emp.employeeId] ? { ...emp, status } : emp,
        ),
      })),
    );

    toast.success(`Marked ${selectedCount} employees as ${status}`);
  };

  const clearSelection = () => {
    setSelectedEmployees({});
    toast.success("Selection cleared");
  };

  const handleSubmit = async () => {
    try {
      const payload: MarkAttendanceSessionPayload = {
        date: dateValue,
        employees: allEmployees.map((emp) => ({
          employeeId: emp.employeeId,
          locationId: emp.selectedLocation,
          status: emp.status,
          shift: emp.shift,
          remarks: emp.remarks,
        })),
      };

      await markAttendanceMutation.mutateAsync(payload);

      toast.success(
        data?.alreadyMarked
          ? "Attendance updated successfully"
          : "Attendance marked successfully",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to mark attendance",
      );
    }
  };

  return {
    data,
    isLoading,
    error,

    dateValue,
    setDate,

    query,
    setQuery,

    statusFilter,
    setStatusFilter,

    stats,

    filteredSectors,
    visibleEmployeeCount,

    selectedEmployees,
    setSelectedEmployees,
    selectedCount,

    markAttendanceMutation,

    handleEmployeeChange,
    handleBulkUpdateStatus,
    clearSelection,
    handleSubmit,
  };
}
