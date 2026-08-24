"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useMe } from "@/hooks/auth/useMe";

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

import {
  getAllEmployees,
  getAttendanceStats,
  getLeaveEmployees,
  getAbsentEmployees,
  filterAttendanceEmployees,
  getPresentSectors,
  getVisibleEmployeeCount,
} from "@/utils/attendance/session/attendanceSelector";

import { buildAttendanceForm } from "@/utils/attendance/session/buildAttendanceForm";

import {
  getDraftKey,
  readDraft,
  removeAttendanceDraft,
  saveAttendanceDraft,
  createAttendanceDraft,
  mergeAttendanceDraft,
} from "@/utils/attendance/session/attendanceDraft";

import type { AttendanceDraft } from "@/utils/attendance/session/attendanceDraft";

import { moveAttendanceEmployee } from "@/utils/attendance/session/moveAttendanceEmployee";

type AttendanceConfirmationAction = "saveSettings" | "submitAttendance";

export function useAttendanceSessionPage() {
  // ======================================
  // API
  // ======================================

  const { data, isLoading, error } = useAttendanceSession();

  const { data: me } = useMe();

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

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const [formInitializedKey, setFormInitializedKey] = useState<string | null>(
    null,
  );

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

  const userId = me?.user?.id;

  const draftKey = userId ? getDraftKey(userId, dateValue) : null;

  // ======================================
  // INITIALIZE FORM
  // ======================================

  const initialSectors = useMemo(
    () => (data?.sectors ? buildAttendanceForm(data.sectors) : []),
    [data],
  );

  useEffect(() => {
    if (!data?.sectors || !draftKey || formInitializedKey === draftKey) {
      return;
    }

    const draft = readDraft(draftKey);

    queueMicrotask(() => {
      setFormInitializedKey(draftKey);

      if (!draft) {
        setSectors(initialSectors);
        return;
      }

      setSectors(mergeAttendanceDraft(initialSectors, draft));
    });
  }, [data?.sectors, draftKey, formInitializedKey, initialSectors]);

  // ======================================
  // ALL EMPLOYEES
  // ======================================

  const allEmployees = useMemo(() => getAllEmployees(sectors), [sectors]);

  // ======================================
  // SAVE DRAFT
  // ======================================

  const handleSaveDraft = () => {
    if (!draftKey || allEmployees.length === 0) {
      return;
    }

    const draft: AttendanceDraft = createAttendanceDraft(
      allEmployees,
      dateValue,
    );

    try {
      setDraftStatus("saving");
      saveAttendanceDraft(draftKey, draft);
      setDraftStatus("saved");
      toast.success("Attendance draft saved.");
    } catch {
      setDraftStatus("idle");
      toast.error("Failed to save attendance draft.");
    }
  };

  // ======================================
  // SECTOR LOCATIONS
  // ======================================

  const sectorLocations = useMemo(() => {
    if (!data?.sectors) {
      return {};
    }

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

  const stats = useMemo(() => getAttendanceStats(allEmployees), [allEmployees]);

  // ======================================
  // SEARCH
  // ======================================

  const searchedEmployees = useMemo(
    () => filterAttendanceEmployees(allEmployees, query, statusFilter),
    [allEmployees, query, statusFilter],
  );

  // ======================================
  // PRESENT SECTORS
  // ======================================

  const presentSectors = useMemo(
    () => getPresentSectors(sectors, query, statusFilter),
    [sectors, query, statusFilter],
  );
  useEffect(() => {
    console.log("========== ATTENDANCE DEBUG ==========");
    console.log("API employees:", data?.stats.totalEmployees);
    console.log("API sectors:", data?.sectors?.length);
    console.log("FORM sectors:", sectors.length);
    console.log("ALL employees:", allEmployees.length);

    console.log(
      "PRESENT employees:",
      allEmployees.filter((employee) => employee.status === "present").length,
    );

    console.log(
      "PRESENT SECTOR employees:",
      presentSectors.reduce(
        (total, sector) =>
          total +
          sector.locations.reduce(
            (count, location) => count + location.employees.length,
            0,
          ),
        0,
      ),
    );

    console.log("FORM sectors data:", sectors);
    console.log("PRESENT sectors data:", presentSectors);

    console.log("======================================");
  }, [data, sectors, allEmployees, presentSectors]);

  // ======================================
  // ABSENT
  // ======================================

  const absentEmployees = useMemo(
    () => getAbsentEmployees(searchedEmployees),
    [searchedEmployees],
  );

  // ======================================
  // LEAVE
  // ======================================

  const leaveEmployees = useMemo(
    () => getLeaveEmployees(searchedEmployees),
    [searchedEmployees],
  );

  // ======================================
  // VISIBLE COUNT
  // ======================================

  const visibleEmployeeCount = useMemo(
    () =>
      getVisibleEmployeeCount(presentSectors, absentEmployees, leaveEmployees),
    [presentSectors, absentEmployees, leaveEmployees],
  );

  // ======================================
  // CONFIRMATION PENDING
  // ======================================

  const isConfirmationPending = useMemo(() => {
    if (confirmationAction === "saveSettings") {
      return isSavingSettings;
    }

    if (confirmationAction === "submitAttendance") {
      return markAttendanceMutation.isPending;
    }

    return false;
  }, [confirmationAction, isSavingSettings, markAttendanceMutation.isPending]);

  // ======================================
  // CONFIRMATION MODAL
  // ======================================

  const confirmationModal = useMemo(() => {
    // Save settings
    if (confirmationAction === "saveSettings") {
      return {
        open: true,

        title: "Save Attendance Settings?",

        description:
          "This will update the locations and default shifts of all present employees using the selections in this attendance session.",

        confirmText: "Save Changes",

        cancelText: "Cancel",
      };
    }

    // Submit attendance
    if (confirmationAction === "submitAttendance") {
      return {
        open: true,

        title: "Submit Attendance?",

        description:
          "Verify each employee's status, location, and shift before submitting. Only present employees will keep location and shift values; absent and leave employees will be submitted with both set to null.",

        confirmText: "Submit Attendance",

        cancelText: "Cancel",
      };
    }

    // Closed
    return {
      open: false,

      title: "",

      description: "",

      confirmText: "Confirm",

      cancelText: "Cancel",
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
    setSectors((previousSectors) =>
      updateEmployee(previousSectors, employeeId, field, value),
    );
  };

  // ======================================
  // EMPLOYEE LOCATION CHANGE
  // ======================================

  const handleEmployeeLocationChange = (
    employeeId: string,
    locationId: string,
  ) => {
    setSectors((previousSectors) =>
      moveAttendanceEmployee(previousSectors, employeeId, locationId),
    );
  };

  // ======================================
  // SAVE SETTINGS
  // ======================================

  const handleSaveSettings = async () => {
    const presentEmployees = allEmployees.filter(
      (employee) => employee.status === "present",
    );

    const employeesWithoutLocation = presentEmployees.filter(
      (employee) => !employee.selectedLocation,
    );

    if (employeesWithoutLocation.length) {
      toast.error("Please select a location for all present employees.");

      return;
    }

    setIsSavingSettings(true);

    try {
      await Promise.all([
        updateEmployeeLocationsMutation.mutateAsync({
          employees: presentEmployees.map((employee) => ({
            employeeId: employee.employeeId,

            locationId: employee.selectedLocation!,
          })),
        }),

        updateEmployeeShiftsMutation.mutateAsync({
          employees: presentEmployees.map((employee) => ({
            employeeId: employee.employeeId,

            shift: employee.shift!,
          })),
        }),
      ]);

      toast.success("Attendance settings updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update attendance settings.",
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ======================================
  // SUBMIT ATTENDANCE
  // ======================================

  const handleSubmit = async () => {
    try {
      await markAttendanceMutation.mutateAsync({
        date: dateValue,

        employees: allEmployees.map((employee) => ({
          employeeId: employee.employeeId,

          locationId:
            employee.status === "present" ? employee.selectedLocation : null,

          shift: employee.status === "present" ? employee.shift : null,

          status: employee.status,

          remarks: employee.remarks.trim(),
        })),
      });

      toast.success(
        data?.alreadyMarked
          ? "Attendance updated successfully."
          : "Attendance marked successfully.",
      );

      if (draftKey) {
        removeAttendanceDraft(draftKey);

        setDraftStatus("idle");
      }
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Failed to submit attendance.",
      );
    }
  };

  // ======================================
  // OPEN SAVE SETTINGS CONFIRMATION
  // ======================================

  const openSaveSettingsConfirmation = () => {
    if (isConfirmationPending) {
      return;
    }

    setConfirmationAction("saveSettings");
  };

  // ======================================
  // OPEN SUBMIT CONFIRMATION
  // ======================================

  const openSubmitAttendanceConfirmation = () => {
    if (isConfirmationPending) {
      return;
    }

    setConfirmationAction("submitAttendance");
  };

  // ======================================
  // CLOSE CONFIRMATION MODAL
  // ======================================

  const closeConfirmationModal = () => {
    if (isConfirmationPending) {
      return;
    }

    // Normal confirmation modal
    setConfirmationAction(null);
  };

  // ======================================
  // CONFIRM ATTENDANCE ACTION
  // ======================================

  const confirmAttendanceAction = async () => {
    // ----------------------------------
    // Nothing to confirm
    // ----------------------------------

    if (!confirmationAction || isConfirmationPending) {
      return;
    }

    // ----------------------------------
    // Save settings
    // ----------------------------------

    if (confirmationAction === "saveSettings") {
      await handleSaveSettings();
    }

    // ----------------------------------
    // Submit attendance
    // ----------------------------------

    if (confirmationAction === "submitAttendance") {
      await handleSubmit();
    }

    setConfirmationAction(null);
  };

  // RETURN
  // ======================================

  return {
    // ----------------------------------
    // API
    // ----------------------------------

    data,
    isLoading,
    error,

    // ----------------------------------
    // Date
    // ----------------------------------

    dateValue,
    setDate,

    // ----------------------------------
    // Filters
    // ----------------------------------

    query,
    setQuery,

    statusFilter,
    setStatusFilter,

    // ----------------------------------
    // Stats
    // ----------------------------------

    stats,

    // ----------------------------------
    // Attendance data
    // ----------------------------------

    sectors,

    presentSectors,

    absentEmployees,

    leaveEmployees,

    allEmployees,

    sectorLocations,

    visibleEmployeeCount,

    // ----------------------------------
    // Confirmation
    // ----------------------------------

    confirmationModal,

    draftStatus,

    isConfirmationPending,

    openSaveSettingsConfirmation,

    handleSaveDraft,

    openSubmitAttendanceConfirmation,

    closeConfirmationModal,

    confirmAttendanceAction,

    // ----------------------------------
    // Employee
    // ----------------------------------

    handleEmployeeChange,

    handleEmployeeLocationChange,

    // ----------------------------------
    // Attendance
    // ----------------------------------

    markAttendanceMutation,

    handleSubmit,

    // ----------------------------------
    // Settings
    // ----------------------------------

    isSavingSettings,
  };
}
