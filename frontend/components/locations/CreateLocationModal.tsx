"use client";

import { useState } from "react";

import { X, MapPin } from "lucide-react";

import { useCreateLocation } from "@/hooks/location/useLocation";
import { sectorOptions } from "@/constants/location";

import { LocationSector } from "@/types/location";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateLocationModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sector, setSector] = useState<LocationSector | "">("");

  const { mutate, isPending, isError, error } = useCreateLocation();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !sector) return;

    mutate(
      {
        name: name.trim(),
        address: address.trim(),
        sector,
      },
      {
        onSuccess: () => {
          setName("");
          setAddress("");
          setSector("");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="relative border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 transition hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3">
              <MapPin size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Create Location</h2>
              <p className="mt-1 text-sm text-blue-100">
                Add a new location to your security management system
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
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
                placeholder="Enter location name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Street / Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* SECTOR */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sector *
              </label>

              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as LocationSector)}
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
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Create Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
