"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
  useUpdateEmployeeLocations,
  useUpdateEmployeeShifts,
} from "@/hooks/attendance/useAttendanceSession";

import type {
  AttendanceFormEmployee,
  AttendanceFormLocation,
  AttendanceFormSector,
} from "@/types/attendance-session";

import { updateEmployee } from "@/utils/attendance/mark/updateEmployee";

type AttendanceConfirmationAction =
  | "saveLocations"
  | "saveShifts"
  | "submitAttendance";

export function useAttendanceSessionPage() {
  // ======================================
  // API
  // ======================================

  const { data, isLoading, error } = useAttendanceSession();

  const markAttendanceMutation = useMarkAttendanceSession();

  const updateEmployeeLocationsMutation = useUpdateEmployeeLocations();

  const updateEmployeeShiftsMutation = useUpdateEmployeeShifts();

  // ======================================
  // STATE
  // ======================================

  const [date, setDate] = useState("");

  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "leave"
  >("all");

  const [sectors, setSectors] = useState<AttendanceFormSector[]>([]);

  const [confirmationAction, setConfirmationAction] =
    useState<AttendanceConfirmationAction | null>(null);

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

              sector: sector.sector._id ?? null,
              currentLocation: location._id,
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
  // SECTOR LOCATIONS
  // ======================================

  const sectorLocations = useMemo(() => {
    if (!data?.sectors) return {};

    return data.sectors.reduce<Record<string, AttendanceFormLocation[]>>(
      (acc, sector) => {
        acc[sector.sector._id ?? "unassigned"] = sector.locations.map(
          (location): AttendanceFormLocation => ({
            ...location,
            employees: [],
          }),
        );

        return acc;
      },
      {},
    );
  }, [data]);

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

  const isConfirmationPending = useMemo(() => {
    if (confirmationAction === "saveLocations") {
      return updateEmployeeLocationsMutation.isPending;
    }

    if (confirmationAction === "saveShifts") {
      return updateEmployeeShiftsMutation.isPending;
    }

    if (confirmationAction === "submitAttendance") {
      return markAttendanceMutation.isPending;
    }

    return false;
  }, [
    confirmationAction,
    markAttendanceMutation.isPending,
    updateEmployeeLocationsMutation.isPending,
    updateEmployeeShiftsMutation.isPending,
  ]);

  const confirmationModal = useMemo(() => {
    if (confirmationAction === "saveLocations") {
      return {
        open: true,
        title: "Save Employee Locations?",
        description:
          "This will update the current locations of all present employees based on the selections in this attendance session.",
        confirmText: "Save Locations",
      };
    }

    if (confirmationAction === "saveShifts") {
      return {
        open: true,
        title: "Save Employee Shifts?",
        description:
          "This will update the default shift of all present employees using the shift currently selected in this attendance session.",
        confirmText: "Save Shifts",
      };
    }

    if (confirmationAction === "submitAttendance") {
      return {
        open: true,
        title: "Submit Attendance?",
        description:
          "Verify each employee's status, location, and shift before submitting. Only present employees will keep location and shift values; absent and leave employees will be submitted with both set to null.",
        confirmText: "Submit Attendance",
      };
    }

    return {
      open: false,
      title: "",
      description: "",
      confirmText: "Confirm",
    };
  }, [confirmationAction]);

  // ======================================
  // EMPLOYEE CHANGE
  // ======================================

  const handleEmployeeChange = (
    employeeId: string,
    field: keyof AttendanceFormEmployee,
    value: unknown,
  ) => {
    setSectors((prev) => updateEmployee(prev, employeeId, field, value));
  };

  // ======================================
  // EMPLOYEE LOCATION CHANGE
  // ======================================

  const handleEmployeeLocationChange = (
    employeeId: string,
    locationId: string,
  ) => {
    setSectors((prev) => {
      let employee: AttendanceFormEmployee | null = null;

      // Remove employee from current location
      const next = prev.map((sector) => ({
        ...sector,
        locations: sector.locations.map((location) => {
          const remaining = location.employees.filter((emp) => {
            if (emp.employeeId !== employeeId) return true;

            employee = {
              ...emp,
              selectedLocation: locationId,
            };

            return false;
          });

          return {
            ...location,
            employeeCount: remaining.length,
            employees: remaining,
          };
        }),
      }));

      if (!employee) return prev;

      // Add employee to new location
      return next.map((sector) => ({
        ...sector,
        locations: sector.locations.map((location) => {
          if (location._id !== locationId) return location;

          return {
            ...location,
            employeeCount: location.employeeCount + 1,
            employees: [...location.employees, employee!],
          };
        }),
      }));
    });
  };

  // ======================================
  // SAVE LOCATIONS
  // ======================================

  const handleSaveLocations = async () => {
    try {
      await updateEmployeeLocationsMutation.mutateAsync({
        employees: allEmployees
          .filter((emp) => emp.status === "present")
          .map((emp) => ({
            employeeId: emp.employeeId,
            locationId: emp.selectedLocation!,
          })),
      });

      toast.success("Employee locations updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update employee locations.",
      );
    }
  };

  // ======================================
  // SAVE SHIFTS
  // ======================================

  const handleSaveShifts = async () => {
    const presentEmployees = allEmployees.filter(
      (emp) => emp.status === "present",
    );

    const employeesWithoutLocation = presentEmployees.filter(
      (emp) => !emp.selectedLocation,
    );

    if (employeesWithoutLocation.length) {
      toast.error("Please select a location for all present employees.");
      return;
    }

    try {
      await updateEmployeeShiftsMutation.mutateAsync({
        employees: presentEmployees.map((emp) => ({
          employeeId: emp.employeeId,
          shift: emp.shift!,
        })),
      });

      toast.success("Employee shifts updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update employee shifts.",
      );
    }
  };

  // ======================================
  // SUBMIT ATTENDANCE
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

  const openSaveLocationsConfirmation = () => {
    if (isConfirmationPending) return;

    setConfirmationAction("saveLocations");
  };

  const openSaveShiftsConfirmation = () => {
    if (isConfirmationPending) return;

    setConfirmationAction("saveShifts");
  };

  const openSubmitAttendanceConfirmation = () => {
    if (isConfirmationPending) return;

    setConfirmationAction("submitAttendance");
  };

  const closeConfirmationModal = () => {
    if (isConfirmationPending) return;

    setConfirmationAction(null);
  };

  const confirmAttendanceAction = async () => {
    if (!confirmationAction || isConfirmationPending) return;

    if (confirmationAction === "saveLocations") {
      await handleSaveLocations();
    }

    if (confirmationAction === "saveShifts") {
      await handleSaveShifts();
    }

    if (confirmationAction === "submitAttendance") {
      await handleSubmit();
    }

    setConfirmationAction(null);
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
    sectorLocations,
    visibleEmployeeCount,

    // Confirmation
    confirmationModal,
    isConfirmationPending,
    openSaveLocationsConfirmation,
    openSaveShiftsConfirmation,
    openSubmitAttendanceConfirmation,
    closeConfirmationModal,
    confirmAttendanceAction,

    // Employee
    handleEmployeeChange,
    handleEmployeeLocationChange,

    // Attendance
    markAttendanceMutation,
    handleSubmit,

    // Locations
    updateEmployeeLocationsMutation,
    handleSaveLocations,

    // Shifts
    updateEmployeeShiftsMutation,
    handleSaveShifts,
  };
}
