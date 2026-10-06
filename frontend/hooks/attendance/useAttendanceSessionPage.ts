"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useMe } from "@/hooks/auth/useMe";
import { useSelectedArea } from "@/components/area/AreaContext";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
  useUpdateEmployeesSector,
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
  const { selectedAreaId, isAreaLoading } = useSelectedArea();

  // ======================================
  // API
  // ======================================

  const { data, isLoading, error } = useAttendanceSession();

  const { data: me } = useMe();

  const markAttendanceMutation = useMarkAttendanceSession();

  const updateEmployeeLocationsMutation = useUpdateEmployeeLocations();

  const updateEmployeesSectorMutation = useUpdateEmployeesSector();

  const updateEmployeeShiftsMutation = useUpdateEmployeeShifts();

  // ======================================
  // STATE
  // ======================================

  const [statusFilter, setStatusFilter] = useState<
    "all" | "present" | "absent" | "leave"
  >("all");

  const [sectorFilter, setSectorFilter] = useState("all");

  const [sectors, setSectors] = useState<AttendanceFormSector[]>([]);

  const [confirmationAction, setConfirmationAction] =
    useState<AttendanceConfirmationAction | null>(null);

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);

  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const [formInitializedKey, setFormInitializedKey] = useState<string | null>(
    null,
  );
  const previousAreaIdRef = useRef(selectedAreaId);

  useEffect(() => {
    if (previousAreaIdRef.current === selectedAreaId) return;

    previousAreaIdRef.current = selectedAreaId;

    queueMicrotask(() => {
      setStatusFilter("all");
      setSectorFilter("all");
      setSectors([]);
      setConfirmationAction(null);
      setIsSavingSettings(false);
      setIsSubmittingAttendance(false);
      setDraftStatus("idle");
      setFormInitializedKey(null);
      markAttendanceMutation.reset();
      updateEmployeeLocationsMutation.reset();
      updateEmployeesSectorMutation.reset();
      updateEmployeeShiftsMutation.reset();
    });
  }, [
    selectedAreaId,
    markAttendanceMutation,
    updateEmployeeLocationsMutation,
    updateEmployeesSectorMutation,
    updateEmployeeShiftsMutation,
  ]);

  // ======================================
  // DATE
  // ======================================

  const defaultDate = useMemo(
    () =>
      data?.attendanceDate.split("T")[0] ??
      new Date().toISOString().split("T")[0],
    [data?.attendanceDate],
  );

  const dateValue = defaultDate;

  const userId = me?.user?.id;

  const draftKey =
    userId && selectedAreaId
      ? getDraftKey(userId, selectedAreaId, dateValue)
      : null;

  // ======================================
  // INITIALIZE FORM
  // ======================================

  const initialSectors = useMemo(
    () => (data?.sectors ? buildAttendanceForm(data.sectors) : []),
    [data],
  );

  useEffect(() => {
    if (
      !selectedAreaId ||
      !data?.sectors ||
      !draftKey ||
      formInitializedKey === draftKey
    ) {
      return;
    }

    const draft = readDraft(draftKey, selectedAreaId);

    queueMicrotask(() => {
      setFormInitializedKey(draftKey);

      if (!draft) {
        setSectors(initialSectors);
        return;
      }

      setSectors(mergeAttendanceDraft(initialSectors, draft));
    });
  }, [
    data?.sectors,
    draftKey,
    formInitializedKey,
    initialSectors,
    selectedAreaId,
  ]);

  const isFormReady = Boolean(
    selectedAreaId && data?.sectors && draftKey && formInitializedKey === draftKey,
  );

  // ======================================
  // ALL EMPLOYEES
  // ======================================

  const allEmployees = useMemo(() => getAllEmployees(sectors), [sectors]);

  // ======================================
  // SAVE DRAFT
  // ======================================

  const handleSaveDraft = () => {
    if (!selectedAreaId || !isFormReady || !draftKey || allEmployees.length === 0) {
      return;
    }

    const draft: AttendanceDraft = createAttendanceDraft(
      allEmployees,
      selectedAreaId,
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
  // FILTERED EMPLOYEES
  // ======================================

  const filteredEmployees = useMemo(
    () =>
      filterAttendanceEmployees(allEmployees, statusFilter, sectorFilter),
    [allEmployees, statusFilter, sectorFilter],
  );

  // ======================================
  // PRESENT SECTORS
  // ======================================

  const presentSectors = useMemo(
    () => getPresentSectors(sectors, statusFilter, sectorFilter),
    [sectors, statusFilter, sectorFilter],
  );

  // ======================================
  // ABSENT
  // ======================================

  const absentEmployees = useMemo(
    () => getAbsentEmployees(filteredEmployees),
    [filteredEmployees],
  );

  // ======================================
  // LEAVE
  // ======================================

  const leaveEmployees = useMemo(
    () => getLeaveEmployees(filteredEmployees),
    [filteredEmployees],
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
      return (
        isSubmittingAttendance ||
        markAttendanceMutation.isPending ||
        updateEmployeesSectorMutation.isPending
      );
    }

    return false;
  }, [
    confirmationAction,
    isSavingSettings,
    isSubmittingAttendance,
    markAttendanceMutation.isPending,
    updateEmployeesSectorMutation.isPending,
  ]);

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
          "This will update sector assignments, locations, and default shifts for present employees using the selections in this attendance session.",

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

  const handleEmployeeSectorChange = (
    employeeId: string,
    sectorId: string,
  ) => {
    const destinationSector = data?.sectors.find(
      (sector) => sector.sector._id === sectorId,
    );
    const destinationLocation = [...(destinationSector?.locations ?? [])].sort(
      (left, right) => left.sortOrder - right.sortOrder,
    )[0];

    if (!destinationLocation) {
      toast.error("This sector has no active locations.");
      return;
    }

    setSectors((previousSectors) =>
      moveAttendanceEmployee(
        previousSectors,
        employeeId,
        destinationLocation._id,
      ),
    );
  };

  const persistSectorChanges = async (
    employees: AttendanceFormEmployee[],
  ) => {
    const sectorChanges = employees.filter(
      (employee) =>
        employee.sector && employee.sector !== employee.currentSector,
    );

    if (!sectorChanges.length) {
      return [];
    }

    if (sectorChanges.some((employee) => !employee.selectedLocation)) {
      throw new Error("Select a destination location for each sector change.");
    }

    await updateEmployeesSectorMutation.mutateAsync({
      employees: sectorChanges.map((employee) => ({
        employeeId: employee.employeeId,
        sectorId: employee.sector!,
        locationId: employee.selectedLocation!,
      })),
    });

    setSectors((previousSectors) =>
      sectorChanges.reduce((nextSectors, employee) => {
        const withCurrentSector = updateEmployee(
          nextSectors,
          employee.employeeId,
          "currentSector",
          employee.sector,
        );
        return updateEmployee(
          withCurrentSector,
          employee.employeeId,
          "currentLocation",
          employee.selectedLocation,
        );
      }, previousSectors),
    );

    return sectorChanges;
  };

  // ======================================
  // SAVE SETTINGS
  // ======================================

  const handleSaveSettings = async () => {
    if (!selectedAreaId || !isFormReady) {
      toast.error("Select an area and wait for its attendance session to load.");
      return;
    }

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
      const sectorChanges = await persistSectorChanges(presentEmployees);

      const transferredEmployeeIds = new Set(
        sectorChanges.map((employee) => employee.employeeId),
      );
      const employeesStayingInSector = presentEmployees.filter(
        (employee) => !transferredEmployeeIds.has(employee.employeeId),
      );

      if (employeesStayingInSector.length) {
        await updateEmployeeLocationsMutation.mutateAsync({
          employees: employeesStayingInSector.map((employee) => ({
            employeeId: employee.employeeId,
            locationId: employee.selectedLocation!,
          })),
        });
      }

      if (presentEmployees.length) {
        await updateEmployeeShiftsMutation.mutateAsync({
          employees: presentEmployees.map((employee) => ({
            employeeId: employee.employeeId,
            shift: employee.shift!,
          })),
        });
      }

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
    if (!selectedAreaId || !isFormReady || isSubmittingAttendance) {
      toast.error("Select an area and wait for its attendance session to load.");
      return;
    }

    try {
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

      setIsSubmittingAttendance(true);
      await persistSectorChanges(presentEmployees);

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
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  // ======================================
  // OPEN SAVE SETTINGS CONFIRMATION
  // ======================================

  const openSaveSettingsConfirmation = () => {
    if (!selectedAreaId || !isFormReady || isConfirmationPending) {
      return;
    }

    setConfirmationAction("saveSettings");
  };

  // ======================================
  // OPEN SUBMIT CONFIRMATION
  // ======================================

  const openSubmitAttendanceConfirmation = () => {
    if (!selectedAreaId || !isFormReady || isConfirmationPending) {
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
    isLoading: isAreaLoading || Boolean(selectedAreaId && isLoading),
    hasSelectedArea: Boolean(selectedAreaId),
    isFormReady,
    error,

    // ----------------------------------
    // Date
    // ----------------------------------

    dateValue,

    // ----------------------------------
    // Filters
    // ----------------------------------

    statusFilter,
    setStatusFilter,

    sectorFilter,
    setSectorFilter,

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

    sectorOptions: (data?.sectors ?? []).flatMap((sector) =>
      sector.sector._id
        ? [
            {
              _id: sector.sector._id,
              name: sector.sector.name,
              hasLocations: sector.locations.length > 0,
            },
          ]
        : [],
    ),

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

    handleEmployeeSectorChange,

    // ----------------------------------
    // Attendance
    // ----------------------------------

    markAttendanceMutation,

    handleSubmit,

    // ----------------------------------
    // Settings
    // ----------------------------------

    isSavingSettings,

    isSubmittingAttendance,

    isUpdatingSectors: updateEmployeesSectorMutation.isPending,
  };
}
