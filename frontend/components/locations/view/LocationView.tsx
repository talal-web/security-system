"use client";

import LocationFilters from "./LocationFilters";
import LocationSector from "./LocationSector";

import { MapPinned } from "lucide-react";
import { useLocationView } from "@/hooks/location/useLocationView";

export default function LocationView() {
  const {
    search,
    setSearch,

    sector,
    setSector,

    isActive,
    setIsActive,
    handleClearFilters,

    locations,
    groupedLocations,

    isLoading,
    isFetching,
    isError,
    error,

    reorderSector,
    setReorderSector,

    reorderItems,
    setReorderItems,

    handleSaveOrder,
    isSavingOrder,

    sectorLabelMap,
  } = useLocationView();

  const totalLocations = locations.length;
  const activeLocations = locations.filter(
    (location) => location.isActive,
  ).length;
  const inactiveLocations = totalLocations - activeLocations;

  // loader only first time
  if (isLoading && locations.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center rounded-3xl border bg-white shadow-sm">
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
    <div className="space-y-6 min-h-150">
      {/* HEADER */}
      <LocationFilters
        search={search}
        onSearchChange={setSearch}
        sector={sector}
        onSectorChange={setSector}
        isActive={isActive}
        onStatusChange={setIsActive}
        onClearFilters={handleClearFilters}
        isFetching={isFetching}
        disabled={!!reorderSector}
        totalLocations={totalLocations}
        activeLocations={activeLocations}
        inactiveLocations={inactiveLocations}
      />

      {/* RESULTS */}
      <div className="min-h-125">
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
              <LocationSector
                key={sectorName}
                sectorName={sectorName}
                sectorLabel={sectorLabelMap[sectorName] || sectorName}
                items={items}
                reorderSector={reorderSector}
                reorderItems={reorderItems}
                setReorderSector={setReorderSector}
                setReorderItems={setReorderItems}
                handleSaveOrder={handleSaveOrder}
                isSavingOrder={isSavingOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
