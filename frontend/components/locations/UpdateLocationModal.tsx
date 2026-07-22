"use client";

import { useState } from "react";

import { X, MapPin, Loader2 } from "lucide-react";

import { useLocation, useUpdateLocation } from "@/hooks/location/useLocation";

import { sectorOptions } from "@/constants/location";

import type { LocationSector, UpdateLocationPayload } from "@/types/location";

type UpdateLocationFormState = Omit<UpdateLocationPayload, "sector"> & {
  name: string;
  address: string;
  sector: LocationSector | "";
  isActive: boolean;
};

type Props = {
  id?: string;
  locationId?: string | null;
  open?: boolean;
  onClose?: () => void;
};

export default function UpdateLocationModal({
  id,
  locationId,
  open,
  onClose,
}: Props) {
  const effectiveLocationId = locationId ?? id ?? null;
  const isModal = open !== undefined;
  const shouldRender = open !== false;

  const { data, isLoading } = useLocation(effectiveLocationId ?? "");

  const { mutate, isPending, isError, error } = useUpdateLocation();

  const [draft, setDraft] = useState<Partial<UpdateLocationFormState>>({});

  const form: UpdateLocationFormState = {
    name: draft.name ?? data?.name ?? "",
    address: draft.address ?? data?.address ?? "",
    sector: draft.sector ?? data?.sector ?? "",
    isActive: draft.isActive ?? data?.isActive ?? true,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "isActive") {
      setDraft((prev) => ({
        ...prev,
        isActive: value === "true",
      }));

      return;
    }

    if (name === "sector") {
      setDraft((prev) => ({
        ...prev,
        sector: value as LocationSector | "",
      }));

      return;
    }

    if (name === "name" || name === "address") {
      setDraft((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    setDraft({});

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
      className={
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          : ""
      }
    >
      <div
        className={
          isModal
            ? "w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
            : "w-full overflow-hidden rounded-3xl bg-white shadow-sm"
        }
      >
        {/* HEADER */}
        <div className="relative border-b border-slate-200 bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
          {isModal && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-xl p-2 transition hover:bg-white/10"
            >
              <X size={20} />
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3">
              <MapPin size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Update Location</h2>

              <p className="mt-1 text-sm text-blue-100">
                Modify location details and save your changes.
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error?.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* NAME */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter location name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Street / Area"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* SECTOR */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Sector *
                </label>

                <select
                  name="sector"
                  value={form.sector}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">Select Sector</option>

                  {sectorOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="isActive"
                  value={form.isActive ? "true" : "false"}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            {/* FOOTER */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
