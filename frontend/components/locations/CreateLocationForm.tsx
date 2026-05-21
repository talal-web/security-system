"use client";

import { useState } from "react";

import { useCreateLocation } from "@/hooks/location/useLocation";

export default function CreateLocationForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [sector, setSector] = useState("");

  const { mutate, isPending, isError, error } = useCreateLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, address, sector },
      {
        onSuccess: () => {
          setName("");
          setAddress("");
          setSector("");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Create Location
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a new location to your system
        </p>
      </div>

      {/* ERROR */}
      {isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error.message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* NAME */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Location Name *
            </label>

            <input
              type="text"
              placeholder="e.g. Main Office"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
              required
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Address
            </label>

            <input
              type="text"
              placeholder="Street / Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
            />
          </div>

          {/* SECTOR */}
          <div>
            <label className="text-sm font-medium text-slate-700">Sector</label>

            <input
              type="text"
              placeholder="A, B, C..."
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating Location..." : "Create Location"}
        </button>
      </form>
    </div>
  );
}
