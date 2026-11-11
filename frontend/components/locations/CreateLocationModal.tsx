"use client";

import { useState } from "react";

import { X, MapPin } from "lucide-react";

import { useCreateLocation } from "@/hooks/location/useLocation";
import { useSelectedArea } from "@/components/area/AreaContext";
import AreaSelect from "@/components/area/AreaSelect";
import SectorSelect from "@/components/sectors/SectorSelect";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const selectWrapperClasses =
  "flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15";

export default function CreateLocationModal({ open, onClose }: Props) {
  const { selectedAreaId } = useSelectedArea();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sectorSelection, setSectorSelection] = useState({
    areaId: selectedAreaId,
    sectorId: "",
  });
  const sector =
    sectorSelection.areaId === selectedAreaId ? sectorSelection.sectorId : "";

  const { mutate, isPending, isError, error } = useCreateLocation();

  const handleClose = () => {
    setName("");
    setAddress("");
    setSectorSelection({ areaId: selectedAreaId, sectorId: "" });
    onClose();
  };

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAreaId || !name.trim() || !sector) return;

    mutate(
      {
        name: name.trim(),
        address: address.trim(),
        area: selectedAreaId,
        sector,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-location-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-[2px] animate-in fade-in duration-150 sm:p-6"
    >
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="relative border-b border-slate-100 px-5 py-4 pr-14 sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close create location dialog"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
              <MapPin className="size-4" />
            </div>

            <div className="min-w-0">
              <h2
                id="create-location-title"
                className="text-base font-semibold text-slate-900"
              >
                Create Location
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Add a new location to your security management system
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                {error?.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* NAME */}
              <div className="sm:col-span-2">
                <label className={labelClasses}>Location Name *</label>

                <input
                  type="text"
                  placeholder="Enter location name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className={labelClasses}>Address</label>

                <input
                  type="text"
                  placeholder="Street / Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  disabled={isPending}
                  wrapperClassName={selectWrapperClasses}
                  required
                />
              </div>

              {/* SECTOR */}
              <div>
                <label className={labelClasses}>Sector *</label>

                <SectorSelect
                  showLabel={false}
                  areaId={selectedAreaId ?? undefined}
                  value={sector}
                  onChange={(e) =>
                    setSectorSelection({
                      areaId: selectedAreaId,
                      sectorId: e.target.value,
                    })
                  }
                  wrapperClassName={selectWrapperClasses}
                  required
                  disabled={!selectedAreaId || isPending}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            <Button variant="secondary" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending || !selectedAreaId || !name.trim() || !sector}
            >
              {isPending ? "Creating..." : "Create Location"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
