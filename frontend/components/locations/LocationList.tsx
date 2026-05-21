"use client";

import Link from "next/link";

import { MapPin, Pencil, CheckCircle2, XCircle } from "lucide-react";

import { useLocations } from "@/hooks/location/useLocation";

import DeleteLocationButton from "./DeleteLocationButton";

export default function LocationList() {
  const { data, isLoading, isError, error } = useLocations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Loading locations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-medium text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          No Locations Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Start by creating your first location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {data.map((location) => (
        <div
          key={location._id}
          className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {location.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {location.address || "No address available"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Sector: {location.sector || "N/A"}
                </p>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                location.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {location.isActive ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}

              {location.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/locations/${location._id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <Pencil size={16} />
              Update
            </Link>

            <DeleteLocationButton id={location._id} name={location.name} />
          </div>
        </div>
      ))}
    </div>
  );
}
