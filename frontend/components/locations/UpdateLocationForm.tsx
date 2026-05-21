"use client";

import { useEffect, useState } from "react";

import { useLocation, useUpdateLocation } from "@/hooks/location/useLocation";

import type { UpdateLocationPayload } from "@/types/location";

export default function UpdateLocationForm({ id }: { id: string }) {
  const { data } = useLocation(id);
  const { mutate, isPending } = useUpdateLocation();

  const [form, setForm] = useState<UpdateLocationPayload>({
    name: "",
    address: "",
    sector: "",
    isActive: true,
  });

  // Sync API data → form state
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        address: data.address || "",
        sector: data.sector || "",
        isActive: data.isActive,
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleUpdate = () => {
    mutate({
      id,
      payload: form,
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Update Location</h2>

      <p className="mt-1 text-sm text-slate-500">
        Modify location details below
      </p>

      {/* FORM GRID */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Location name"
            className="mt-1 w-full rounded-xl border p-3 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-slate-700">Address</label>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Location address"
            className="mt-1 w-full rounded-xl border p-3 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Sector */}
        <div>
          <label className="text-sm font-medium text-slate-700">Sector</label>

          <input
            name="sector"
            value={form.sector}
            onChange={handleChange}
            placeholder="Sector (e.g. A, B, C)"
            className="mt-1 w-full rounded-xl border p-3 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>

          <select
            name="isActive"
            value={form.isActive ? "true" : "false"}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border p-3 focus:border-blue-500 outline-none"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Updating..." : "Update Location"}
        </button>
      </div>
    </div>
  );
}
