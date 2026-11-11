"use client";

import AttendanceHeader from "@/components/attendance/session/AttendanceHeader";
import AttendanceFilters from "@/components/attendance/session/AttendanceFilter";
import AttendanceStats from "@/components/attendance/session/AttendanceStats";
import AttendanceSectorList from "@/components/attendance/session/AttendanceSectorList";
import AttendanceAbsentLeaveList from "@/components/attendance/session/AttendanceAbsentLeaveList";
import AttendanceSubmitPreviewModal from "@/components/attendance/session/AttendanceSubmitPreviewModal";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer } from "@/components/ui/PageHeader";
import {
  EmptyState,
  ErrorState,
  FullPageLoader,
} from "@/components/ui/States";
import { MapPin } from "lucide-react";

import { useAttendanceSessionPage } from "@/hooks/attendance/useAttendanceSessionPage";

export default function AttendanceSessionPage() {
  const attendance = useAttendanceSessionPage();

  if (attendance.isLoading) {
    return <FullPageLoader />;
  }

  if (!attendance.hasSelectedArea) {
    return (
      <PageContainer>
        <EmptyState
          icon={MapPin}
          title="No area selected"
          description="Select an area to load its attendance session."
        />
      </PageContainer>
    );
  }

  if (attendance.error) {
    return (
      <PageContainer>
        <ErrorState
          description={
            attendance.error instanceof Error
              ? attendance.error.message
              : "Something went wrong."
          }
        />
      </PageContainer>
    );
  }

  if (!attendance.isFormReady) {
    return <FullPageLoader />;
  }

  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <PageContainer>
        <AttendanceHeader
          attendanceDate={
            attendance.data?.attendanceDate ?? attendance.dateValue
          }
          alreadyMarked={attendance.data?.alreadyMarked ?? false}
        />

        <AttendanceFilters
          dateValue={attendance.dateValue}
          statusFilter={attendance.statusFilter}
          sectorFilter={attendance.sectorFilter}
          sectorOptions={attendance.sectorOptions}
          isSubmitting={
            attendance.isSubmittingAttendance ||
            attendance.markAttendanceMutation.isPending ||
            attendance.isUpdatingSectors
          }
          isSavingSettings={attendance.isSavingSettings}
          confirmationModalOpen={
            attendance.confirmationModal.open &&
            attendance.confirmationAction !== "submitAttendance"
          }
          confirmationTitle={attendance.confirmationModal.title}
          confirmationDescription={attendance.confirmationModal.description}
          confirmationConfirmText={attendance.confirmationModal.confirmText}
          confirmationCancelText={attendance.confirmationModal.cancelText}
          confirmationIsLoading={attendance.isConfirmationPending}
          draftStatus={attendance.draftStatus}
          onStatusFilterChange={attendance.setStatusFilter}
          onSectorFilterChange={attendance.setSectorFilter}
          onSaveSettings={attendance.openSaveSettingsConfirmation}
          onSaveDraft={attendance.handleSaveDraft}
          onSubmit={attendance.openSubmitAttendanceConfirmation}
          onConfirmAction={attendance.confirmAttendanceAction}
          onCancelConfirmation={attendance.closeConfirmationModal}
        />

        <AttendanceStats {...attendance.stats} />

        <AttendanceSectorList
          sectors={attendance.presentSectors}
          sectorLocations={attendance.sectorLocations}
          sectorOptions={attendance.sectorOptions}
          onEmployeeChange={attendance.handleEmployeeChange}
          onEmployeeLocationChange={attendance.handleEmployeeLocationChange}
          onEmployeeSectorChange={attendance.handleEmployeeSectorChange}
        />

        <AttendanceAbsentLeaveList
          absentEmployees={attendance.absentEmployees}
          leaveEmployees={attendance.leaveEmployees}
          onEmployeeChange={attendance.handleEmployeeChange}
        />

        <AttendanceSubmitPreviewModal
          open={attendance.confirmationAction === "submitAttendance"}
          presentSectors={attendance.previewPresentSectors}
          absentEmployees={attendance.previewAbsentEmployees}
          leaveEmployees={attendance.previewLeaveEmployees}
          stats={attendance.stats}
          isLoading={attendance.isConfirmationPending}
          onConfirm={attendance.confirmAttendanceAction}
          onCancel={attendance.closeConfirmationModal}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}
