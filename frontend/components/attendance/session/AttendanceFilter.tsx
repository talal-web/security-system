"use client";

import { Calendar, Save, Send, SlidersHorizontal } from "lucide-react";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";

const controlClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-card focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";

interface AttendanceFiltersProps {
  dateValue: string;
  statusFilter: "all" | "present" | "absent" | "leave";
  sectorFilter: string;
  sectorOptions: { _id: string; name: string }[];

  isSubmitting: boolean;
  isSavingSettings: boolean;
  confirmationModalOpen: boolean;
  confirmationTitle: string;
  confirmationDescription: string;
  confirmationConfirmText: string;
  confirmationCancelText: string;
  confirmationIsLoading: boolean;
  draftStatus: "idle" | "saving" | "saved";

  onStatusFilterChange: (value: "all" | "present" | "absent" | "leave") => void;
  onSectorFilterChange: (value: string) => void;

  onSaveSettings: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onConfirmAction: () => void;
  onCancelConfirmation: () => void;
}

export default function AttendanceFilters({
  dateValue,
  statusFilter,
  sectorFilter,
  sectorOptions,

  isSubmitting,
  isSavingSettings,
  confirmationModalOpen,
  confirmationTitle,
  confirmationDescription,
  confirmationConfirmText,
  confirmationCancelText,
  confirmationIsLoading,
  draftStatus,

  onStatusFilterChange,
  onSectorFilterChange,

  onSaveSettings,
  onSaveDraft,
  onSubmit,
  onConfirmAction,
  onCancelConfirmation,
}: AttendanceFiltersProps) {
  return (
    <>
      <Card>
        <CardHeader
          icon={SlidersHorizontal}
          title="Attendance Controls"
          description={
            <span className="whitespace-normal">
              Filter attendance by status and sector, update assignments, and
              submit today&apos;s attendance.
            </span>
          }
        />

        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date */}
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              type="date"
              value={dateValue}
              readOnly
              aria-label="Attendance date, today"
              className="h-9 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-600 outline-none"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value as "all" | "present" | "absent" | "leave",
              )
            }
            className={controlClass}
          >
            <option value="all">All Employees</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>

          {/* Sector */}
          <select
            value={sectorFilter}
            onChange={(e) => onSectorFilterChange(e.target.value)}
            aria-label="Filter by sector"
            className={controlClass}
          >
            <option value="all">All Sectors</option>
            {sectorOptions.map((sector) => (
              <option key={sector._id} value={sector._id}>
                {sector.name}
              </option>
            ))}
          </select>
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-xs text-slate-500 sm:mr-auto">
            {draftStatus === "saving" && "Saving draft..."}
            {draftStatus === "saved" && "Draft saved"}
          </span>

          {/* Save Draft */}
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            disabled={
              isSubmitting || isSavingSettings || draftStatus === "saving"
            }
            className="w-full sm:w-auto"
          >
            <Save />
            Save Draft
          </Button>

          {/* Save Settings */}
          <Button
            variant="secondary"
            onClick={onSaveSettings}
            disabled={isSavingSettings || isSubmitting}
            className="w-full sm:w-auto"
          >
            <Save />

            {isSavingSettings ? "Saving..." : "Save Changes"}
          </Button>

          {/* Submit Attendance */}
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || isSavingSettings}
            className="w-full sm:w-auto"
          >
            <Send />

            {isSubmitting ? "Saving..." : "Submit Attendance"}
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationModal
        open={confirmationModalOpen}
        title={confirmationTitle}
        description={confirmationDescription}
        confirmText={confirmationConfirmText}
        cancelText={confirmationCancelText}
        isLoading={confirmationIsLoading}
        onConfirm={onConfirmAction}
        onCancel={onCancelConfirmation}
      />
    </>
  );
}
