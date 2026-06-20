"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { MapPin, Pencil, Building2, Search, MapPinned } from "lucide-react";

import { useLocations } from "@/hooks/location/useLocation";
import { sectorOptions } from "@/constants/location";
import { LocationSector } from "@/types/location";

export default function LocationView() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sector, setSector] = useState<LocationSector>();
  const [isActive, setIsActive] = useState<boolean | undefined>(true);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: locations = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useLocations({
    search: debouncedSearch,
    sector,
    isActive,
  });

  // group locations
  const groupedLocations = useMemo(() => {
    return locations.reduce((acc: Record<string, typeof locations>, loc) => {
      const key = loc.sector || "Unassigned";
      if (!acc[key]) acc[key] = [];
      acc[key].push(loc);
      return acc;
    }, {});
  }, [locations]);

  // ✅ build label map from your existing sectorOptions
  const sectorLabelMap = useMemo(() => {
    return sectorOptions.reduce(
      (acc, item) => {
        acc[item.value] = item.label;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, []);

  // loader only first time
  if (isLoading && locations.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-white shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading locations...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">
          {error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[600px]">
      {/* HEADER */}
      <div className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex justify-end">
          {isFetching && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              Searching...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="h-12 w-full rounded-2xl border bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* SECTOR */}
          <select
            value={sector ?? ""}
            onChange={(e) =>
              setSector(
                e.target.value ? (e.target.value as LocationSector) : undefined,
              )
            }
            className="h-12 rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Sectors</option>
            {sectorOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={
              isActive === undefined ? "" : isActive ? "active" : "inactive"
            }
            onChange={(e) =>
              setIsActive(
                e.target.value === "" ? undefined : e.target.value === "active",
              )
            }
            className="h-12 rounded-2xl border bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* RESULTS */}
      <div className="min-h-[500px]">
        {locations.length === 0 && !isFetching ? (
          <div className="rounded-3xl border border-dashed bg-white py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <MapPinned className="text-slate-400" size={32} />
            </div>
            <h2 className="mt-5 text-xl font-semibold">No Locations Found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try changing filters or search keyword
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLocations).map(([sectorName, items]) => (
              <div
                key={sectorName}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm"
              >
                {/* SECTOR HEADER (UPDATED) */}
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">
                        {sectorLabelMap[sectorName] || sectorName}
                      </h2>

                      <p className="text-xs text-slate-500">
                        {items.length} location{items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GRID */}
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((loc) => (
                    <div
                      key={loc._id}
                      className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-blue-600" size={18} />
                          <h3 className="font-semibold text-slate-800">
                            {loc.name}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                            loc.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {loc.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {loc.address || "No address provided"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        ID: {loc._id.slice(-6)}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <Link
                          href={`/locations/${loc._id}/edit`}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700 transition hover:bg-blue-100"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
