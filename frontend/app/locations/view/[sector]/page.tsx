"use client";

import Link from "next/link";

import { formatText } from "@/lib/employeeFormat";

import { useParams } from "next/navigation";

import {
  ArrowLeft,
  MapPin,
  Pencil,
  CheckCircle2,
  XCircle,
  Building2,
  Search,
} from "lucide-react";

import { useMemo, useState } from "react";

import { useLocations } from "@/hooks/location/useLocation";

export default function SectorLocationsPage() {
  const params = useParams();

  const sector = decodeURIComponent(params.sector as string);

  const { data, isLoading, isError, error } = useLocations();

  const [search, setSearch] = useState("");

  // FILTER LOCATIONS
  const sectorLocations = useMemo(() => {
    if (!data) return [];

    return data
      .filter((location) => (location.sector || "Unassigned") === sector)
      .filter((location) => {
        const keyword = search.toLowerCase();

        return location.name?.toLowerCase().includes(keyword);
      });
  }, [data, sector, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading locations...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-100 p-4 text-blue-700">
              <Building2 size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {formatText(sector)}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {sectorLocations.length} locations found
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            {/* SEARCH */}
            <div className="relative w-full sm:w-[320px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* BACK BUTTON */}
            <Link
              href="/locations/view"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!sectorLocations.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Search className="text-slate-400" size={32} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-800">
            No Locations Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try searching with another keyword.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE CARDS */}
          <div className="grid grid-cols-1 gap-5 lg:hidden">
            {sectorLocations.map((location) => (
              <div
                key={location._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                      <MapPin size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {location.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {location.address || "No address available"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        ID: {location._id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      location.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {location.isActive ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <XCircle size={13} />
                    )}

                    {location.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/locations/${location._id}/edit`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <Pencil size={16} />
                    Update Location
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Address
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sectorLocations.map((location) => (
                    <tr
                      key={location._id}
                      className="transition hover:bg-blue-50/40"
                    >
                      {/* LOCATION */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                            <MapPin size={20} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {location.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: {location._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ADDRESS */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {location.address || "No address available"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                            location.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {location.isActive ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}

                          {location.isActive ? "Active" : "Inactive"}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/locations/${location._id}/edit`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil size={16} />
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
