"use client";

import { useEffect, useState } from "react";

import { useLocation, useUpdateLocation } from "@/hooks/location/useLocation";

import type { UpdateLocationPayload } from "@/types/location";

import { sectorOptions } from "@/constants/location";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Update Location
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Modify location details below
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* NAME */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Location Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Location name"
            className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm font-medium text-slate-700">Address</label>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Location address"
            className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* SECTOR */}
        <div>
          <label className="text-sm font-medium text-slate-700">Sector</label>

          <select
            name="sector"
            value={form.sector}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-500"
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
          <label className="text-sm font-medium text-slate-700">Status</label>

          <select
            name="isActive"
            value={form.isActive ? "true" : "false"}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-500"
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
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Updating Location..." : "Update Location"}
        </button>
      </div>
    </div>
  );
}
