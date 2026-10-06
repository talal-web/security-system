"use client";

import { Calendar, Save, Send } from "lucide-react";

import ConfirmationModal from "@/components/ui/ConfirmationModal";

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
      <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Attendance Controls
            </h2>

            <p className="text-sm text-slate-500">
              Filter attendance by status and sector, update assignments, and
              submit today&apos;s attendance.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

            <input
              type="date"
              value={dateValue}
              readOnly
              aria-label="Attendance date, today"
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none"
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
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Sectors</option>
            {sectorOptions.map((sector) => (
              <option key={sector._id} value={sector._id}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <span className="mr-auto self-center text-xs text-slate-500">
            {draftStatus === "saving" && "Saving draft..."}
            {draftStatus === "saved" && "Draft saved"}
          </span>

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={
              isSubmitting || isSavingSettings || draftStatus === "saving"
            }
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>

          {/* Save Settings */}
          <button
            type="button"
            onClick={onSaveSettings}
            disabled={isSavingSettings || isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {isSavingSettings ? "Saving..." : "Save Changes"}
          </button>

          {/* Submit Attendance */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isSavingSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />

            {isSubmitting ? "Saving..." : "Submit Attendance"}
          </button>
        </div>
      </div>

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
