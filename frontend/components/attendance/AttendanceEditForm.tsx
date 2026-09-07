"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  Check,
  FileText,
  Loader2,
  MapPin,
  Moon,
  Save,
  Sun,
  X,
} from "lucide-react";

import { useLocations } from "@/hooks/location/useLocation";
import { useUpdateAttendance } from "@/hooks/attendance/useAttendance";
import type {
  AttendanceRecord,
  AttendanceShift,
  AttendanceStatus,
  UpdateAttendancePayload,
} from "@/types/attendance";

interface AttendanceEditFormProps {
  attendance: AttendanceRecord;
  onSuccess?: (attendance: AttendanceRecord) => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "present",
    label: "Present",
    description: "Employee was on duty",
  },
  {
    value: "absent",
    label: "Absent",
    description: "Employee was not present",
  },
  {
    value: "leave",
    label: "Leave",
    description: "Employee was on leave",
  },
];

export default function AttendanceEditForm({
  attendance,
  onSuccess,
  onCancel,
}: AttendanceEditFormProps) {
  const updateAttendance = useUpdateAttendance();

  const {
    data: locations,
    isLoading: isLoadingLocations,
    isError: isLocationsError,
  } = useLocations({
    isActive: true,
  });

  const [status, setStatus] = useState<AttendanceStatus>(attendance.status);

  const [shift, setShift] = useState<AttendanceShift | "">(
    attendance.shift ?? "",
  );

  const [location, setLocation] = useState(attendance.location ?? "");

  const [remarks, setRemarks] = useState(attendance.remarks ?? "");

  const [error, setError] = useState("");

  const isPending = updateAttendance.isPending;

  const handleStatusChange = (nextStatus: AttendanceStatus) => {
    setStatus(nextStatus);
    setError("");

    // Shift and location only apply to present attendance.
    if (nextStatus !== "present") {
      setShift("");
      setLocation("");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (status === "present" && !shift) {
      setError("Please select a shift for present attendance.");
      return;
    }

    if (status === "present" && !location) {
      setError("Please select a location for present attendance.");
      return;
    }

    const payload: UpdateAttendancePayload = {
      status,
      shift: status === "present" && shift ? shift : null,
      location: status === "present" ? location : null,
      remarks: remarks.trim(),
    };

    updateAttendance.mutate(
      {
        id: attendance._id,
        payload,
      },
      {
        onSuccess,
        onError: (mutationError) => {
          setError(
            mutationError instanceof Error
              ? mutationError.message
              : "Failed to update attendance.",
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <CalendarCheck className="size-4" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Edit Attendance</h2>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Update attendance details for {attendance.employeeSnapshot.name}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Form Content                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-4 p-4">
        {/* ---------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Attendance Status
            </label>
            <span className="text-xs text-muted-foreground">
              Select a status
            </span>
          </div>

          <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(option.value)}
                  className={[
                    "relative flex h-9 items-center justify-center rounded-md px-2 text-xs font-semibold transition-all",
                    "hover:bg-background hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                    isSelected
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500",
                    isPending && "cursor-not-allowed opacity-60",
                  ].join(" ")}
                >
                  {isSelected && <Check className="mr-1 size-3.5" />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Present Attendance Details                                       */}
        {/* ---------------------------------------------------------------- */}

        {status === "present" && (
          <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Duty Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Shift */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Shift
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <ShiftButton
                    selected={shift === "day"}
                    disabled={isPending}
                    icon={<Sun className="size-4" />}
                    label="Day"
                    onClick={() => {
                      setShift("day");
                      setError("");
                    }}
                  />

                  <ShiftButton
                    selected={shift === "night"}
                    disabled={isPending}
                    icon={<Moon className="size-4" />}
                    label="Night"
                    onClick={() => {
                      setShift("night");
                      setError("");
                    }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="attendance-location"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <select
                    id="attendance-location"
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setError("");
                    }}
                    disabled={isPending || isLoadingLocations}
                    className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white pl-9 pr-9 text-sm outline-none transition-colors hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {isLoadingLocations
                        ? "Loading locations..."
                        : "Select location"}
                    </option>

                    {locations?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ▾
                  </div>
                </div>

                {isLocationsError && (
                  <p className="mt-2 text-xs text-destructive">
                    Unable to load locations.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Remarks                                                           */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="attendance-remarks"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <FileText className="size-4 text-muted-foreground" />
              Remarks
            </label>

            <span className="text-xs text-muted-foreground">
              {remarks.length}/500
            </span>
          </div>

          <textarea
            id="attendance-remarks"
            value={remarks}
            onChange={(event) => {
              if (event.target.value.length <= 500) {
                setRemarks(event.target.value);
              }
            }}
            disabled={isPending}
            rows={3}
            placeholder="Add any relevant notes about this attendance..."
            className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-5 outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />

            <div className="min-w-0">
              <p className="font-medium">Unable to save changes</p>
              <p className="mt-0.5 text-xs leading-5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer / Actions                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="size-4" />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isPending || isLoadingLocations}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Attendance
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Shift Button                                                               */
/* -------------------------------------------------------------------------- */

interface ShiftButtonProps {
  selected: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ShiftButton({
  selected,
  disabled,
  icon,
  label,
  onClick,
}: ShiftButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200",
        selected
          ? "border-blue-500 bg-blue-50 text-blue-600 ring-1 ring-blue-100"
          : "border-slate-300 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
        disabled && "cursor-not-allowed opacity-60",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
