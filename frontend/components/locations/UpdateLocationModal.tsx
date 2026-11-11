"use client";

import { useState } from "react";

import { X, MapPin, Loader2 } from "lucide-react";

import { useLocation, useUpdateLocation } from "@/hooks/location/useLocation";
import { useSelectedArea } from "@/components/area/AreaContext";
import AreaSelect from "@/components/area/AreaSelect";
import SectorSelect from "@/components/sectors/SectorSelect";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import type { LocationSectorId, UpdateLocationPayload } from "@/types/location";

type UpdateLocationFormState = Omit<
  UpdateLocationPayload,
  "sector"
> & {
  name: string;
  address: string;
  sector: LocationSectorId | "";
  isActive: boolean;
};

type Props = {
  id?: string;
  locationId?: string | null;
  open?: boolean;
  onClose?: () => void;
};

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const selectWrapperClasses =
  "flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15";

export default function UpdateLocationModal({
  id,
  locationId,
  open,
  onClose,
}: Props) {
  const effectiveLocationId = locationId ?? id ?? null;
  const { selectedAreaId } = useSelectedArea();
  const isModal = open !== undefined;
  const shouldRender = open !== false;

  const {
    data,
    isLoading,
    isError: isLocationError,
    error: locationError,
  } = useLocation(
    effectiveLocationId ?? "",
  );

  const {
    mutate,
    isPending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateLocation();

  const draftScopeKey = `${selectedAreaId ?? ""}:${effectiveLocationId ?? ""}:${open !== false}`;
  const [draftState, setDraftState] = useState<{
    scopeKey: string;
    values: Partial<UpdateLocationFormState>;
  }>({ scopeKey: draftScopeKey, values: {} });
  const draft =
    draftState.scopeKey === draftScopeKey ? draftState.values : {};
  const updateDraft = (values: Partial<UpdateLocationFormState>) => {
    setDraftState((previous) => ({
      scopeKey: draftScopeKey,
      values: {
        ...(previous.scopeKey === draftScopeKey ? previous.values : {}),
        ...values,
      },
    }));
  };

  const form: UpdateLocationFormState = {
    name: draft.name ?? data?.name ?? "",
    address: draft.address ?? data?.address ?? "",
    sector: draft.sector ?? data?.sector?._id ?? "",
    isActive: draft.isActive ?? data?.isActive ?? true,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "isActive") {
      updateDraft({
        isActive: value === "true",
      });

      return;
    }

    if (name === "sector") {
      updateDraft({
        sector: value,
      });

      return;
    }

    if (name === "name" || name === "address") {
      updateDraft({
        [name]: value,
      });
    }
  };

  const handleClose = () => {
    setDraftState({ scopeKey: draftScopeKey, values: {} });

    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveLocationId) return;

    const payload: UpdateLocationPayload = {
      name: form.name,
      address: form.address,
      isActive: form.isActive,
      sector: form.sector || undefined,
    };

    mutate(
      {
        id: effectiveLocationId,
        payload,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  if (!shouldRender) return null;

  return (
    <div
      role={isModal ? "dialog" : undefined}
      aria-modal={isModal ? true : undefined}
      aria-label={isModal ? "Update location" : undefined}
      className={
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] animate-in fade-in duration-150 sm:p-6"
          : ""
      }
    >
      <div
        className={cn(
          "w-full overflow-hidden rounded-xl border bg-white",
          isModal
            ? "relative my-auto max-w-2xl border-slate-200 shadow-pop animate-in fade-in zoom-in-95 duration-200"
            : "border-slate-200/80 shadow-card",
        )}
      >
        {/* HEADER */}
        <div className="relative border-b border-slate-100 px-5 py-4 pr-14 sm:px-6">
          {isModal && (
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              aria-label="Close update location dialog"
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
              <MapPin className="size-4" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">
                Update Location
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Modify location details and save your changes.
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </div>
        ) : isLocationError || !data ? (
          <div className="space-y-4 p-5 sm:p-6">
            <div className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
              {locationError instanceof Error
                ? locationError.message
                : "This location is unavailable in the selected area."}
            </div>
            {isModal && (
              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-5 sm:p-6">
              {isUpdateError && (
                <div className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                  {updateError?.message}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NAME */}
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Location Name *</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter location name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className={labelClasses}>Address</label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Street / Area"
                    value={form.address}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>

                {/* AREA */}
                <div>
                  <label className={labelClasses}>Area *</label>

                  <AreaSelect
                    showLabel={false}
                    value={selectedAreaId ?? ""}
                    useGlobalSelection
                    disabled
                    wrapperClassName={cn(selectWrapperClasses, "bg-slate-50")}
                    required
                  />
                </div>

                {/* SECTOR */}
                <div>
                  <label className={labelClasses}>Sector *</label>

                  <SectorSelect
                    showLabel={false}
                    name="sector"
                    areaId={selectedAreaId ?? undefined}
                    value={form.sector}
                    onChange={handleChange}
                    wrapperClassName={selectWrapperClasses}
                    required
                    disabled={!selectedAreaId || isPending}
                  />
                </div>

                {/* STATUS */}
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Status</label>

                  <select
                    name="isActive"
                    value={form.isActive ? "true" : "false"}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isPending || !selectedAreaId || !form.sector}
              >
                Cancel
              </Button>

              <Button type="submit" loading={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
