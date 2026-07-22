"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
} from "@/hooks/attendance/useAttendanceSession";

import type {
  AttendanceFormEmployee,
  AttendanceFormLocation,
  AttendanceFormSector,
} from "@/types/attendance-session";

import { updateEmployee } from "@/utils/attendance/mark/updateEmployee";

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

  const initialSectors = useMemo(() => {
    if (!data?.sectors) return [] as AttendanceFormSector[];

    return data.sectors.map((sector) => ({
      sector: sector.sector,
      totalEmployees: sector.totalEmployees,
      totalLocations: sector.totalLocations,

      locations: sector.locations.map(
        (location): AttendanceFormLocation => ({
          ...location,

          employees: location.employees.map(
            (emp): AttendanceFormEmployee => ({
              ...emp,

              currentLocation: {
                _id: location._id,
                name: location.name,
                isActive: location.isActive,
              },

              selectedLocation: location._id,

              status: "present",

              shift: emp.defaultShift ?? null,

              remarks: "",
            }),
          ),
        }),
      ),
    })) as AttendanceFormSector[];
  }, [data]);

  useEffect(() => {
    if (!data?.sectors) return;

    queueMicrotask(() => {
      setSectors(initialSectors);
    });
  }, [data?.sectors, initialSectors]);

  // ======================================
  // ALL EMPLOYEES
  // ======================================

  const allEmployees = useMemo(
    () =>
      sectors.flatMap((sector) =>
        sector.locations.flatMap((location) => location.employees),
      ),
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

  // ======================================
  // SEARCH
  // ======================================

  const searchedEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allEmployees.filter((emp) => {
      const matchesQuery =
        q === "" ||
        [emp.name, emp.empId, emp.fatherName, emp.designation]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesStatus =
        statusFilter === "all" || emp.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [allEmployees, query, statusFilter]);

  // ======================================
  // PRESENT SECTORS
  // ======================================

  const presentSectors = useMemo(() => {
    const q = query.trim().toLowerCase();

    return sectors
      .map((sector) => ({
        ...sector,

        locations: sector.locations
          .map((location) => ({
            ...location,

            employees: location.employees.filter((emp) => {
              if (emp.status !== "present") return false;

              if (statusFilter !== "all" && statusFilter !== "present") {
                return false;
              }

              if (!q) return true;

              return [
                emp.name,
                emp.empId,
                emp.fatherName,
                emp.designation,
                location.name,
              ]
                .join(" ")
                .toLowerCase()
                .includes(q);
            }),
          }))
          .filter((location) => location.employees.length > 0),
      }))
      .filter((sector) => sector.locations.length > 0);
  }, [sectors, query, statusFilter]);

  // ======================================
  // ABSENT
  // ======================================

  const absentEmployees = useMemo(
    () => searchedEmployees.filter((emp) => emp.status === "absent"),
    [searchedEmployees],
  );

  // ======================================
  // LEAVE
  // ======================================

  const leaveEmployees = useMemo(
    () => searchedEmployees.filter((emp) => emp.status === "leave"),
    [searchedEmployees],
  );

  // ======================================
  // VISIBLE COUNT
  // ======================================

  const visibleEmployeeCount = useMemo(
    () =>
      presentSectors.reduce(
        (total, sector) =>
          total +
          sector.locations.reduce(
            (count, location) => count + location.employees.length,
            0,
          ),
        0,
      ) +
      absentEmployees.length +
      leaveEmployees.length,
    [presentSectors, absentEmployees, leaveEmployees],
  );
  const handleEmployeeChange = (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => {
    setSectors((prev) => updateEmployee(prev, employeeId, field, value));
  };
  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = async () => {
    try {
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
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Failed to submit attendance.",
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

    allEmployees,
    visibleEmployeeCount,

    markAttendanceMutation,
    handleEmployeeChange,
    handleSubmit,
  };
}
