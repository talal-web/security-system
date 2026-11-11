"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  Check,
  ChevronDown,
  FileText,
  Loader2,
  MapPin,
  Moon,
  Save,
  Sun,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { CardFooter, CardHeader } from "@/components/ui/Card";
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
      className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <CardHeader
        icon={CalendarCheck}
        title="Edit Attendance"
        description={`Update attendance details for ${attendance.employeeSnapshot.name}`}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Form Content                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-5 p-4 sm:p-5">
        {/* ---------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label className="text-xs font-medium text-slate-600">
              Attendance Status
            </label>
            <span className="text-xs text-slate-400">Select a status</span>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(option.value)}
                  className={[
                    "relative flex h-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    isSelected
                      ? option.value === "present"
                        ? "bg-white text-emerald-700 shadow-card ring-1 ring-emerald-600/20"
                        : option.value === "absent"
                          ? "bg-white text-red-700 shadow-card ring-1 ring-red-600/20"
                          : "bg-white text-amber-700 shadow-card ring-1 ring-amber-600/20"
                      : "text-slate-500 hover:bg-white hover:text-slate-900",
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
          <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Duty Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Shift */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
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
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                  <select
                    id="attendance-location"
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setError("");
                    }}
                    disabled={isPending || isLoadingLocations}
                    className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-700 shadow-card outline-none transition-colors focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
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

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>

                {isLocationsError && (
                  <p className="mt-1.5 text-xs text-red-600">
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
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label
              htmlFor="attendance-remarks"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
            >
              <FileText className="size-3.5 text-slate-400" />
              Remarks
            </label>

            <span className="text-xs text-slate-400 tabular-nums">
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
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-700 shadow-card outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />

            <div className="min-w-0">
              <p className="font-semibold text-red-800">
                Unable to save changes
              </p>
              <p className="mt-0.5 text-xs leading-5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer / Actions                                                    */}
      {/* ------------------------------------------------------------------ */}

      <CardFooter className="flex-col-reverse items-stretch sm:flex-row sm:items-center">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            <X />
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isPending || isLoadingLocations}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save />
              Save Attendance
            </>
          )}
        </Button>
      </CardFooter>
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
        "flex h-9 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        selected
          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500/20"
          : "border-slate-200 bg-white text-slate-600 shadow-card hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
        disabled && "cursor-not-allowed opacity-60",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
