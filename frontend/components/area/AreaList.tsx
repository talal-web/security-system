"use client";

import { useAreas } from "@/hooks/area/useArea";
import AreaActions from "@/components/area/AreaActions";
import type { Area } from "@/types/area";

export default function AreaList() {
  const { data, isPending, isError, error, refetch } = useAreas();

  const areas: Area[] = Array.isArray(data) ? data : [];

  if (isPending) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">Loading areas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load areas."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-gray-800">No areas found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add your first area to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Areas</h2>
          <p className="text-sm text-gray-500">Manage your operational areas</p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {areas.length} total
        </span>
      </div>

      {/* Area list */}
      <div className="divide-y divide-gray-100">
        {areas.map((area: Area) => (
          <div
            key={area._id}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Area details */}
            <div className="min-w-0">
              <h3 className="truncate font-medium text-gray-900">
                {area.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {area.description || "No description provided"}
              </p>
            </div>

            {/* Status and actions */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  area.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {area.isActive ? "Active" : "Inactive"}
              </span>
              <AreaActions area={area} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
