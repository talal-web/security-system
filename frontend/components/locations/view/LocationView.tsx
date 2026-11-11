"use client";

import { useState } from "react";

import CreateLocationModal from "@/components/locations/CreateLocationModal";
import UpdateLocationModal from "@/components/locations/UpdateLocationModal";
import { exportLocationsExcel } from "@/utils/export/Locations";

import LocationFilters from "./LocationFilters";
import LocationSector from "./LocationSector";

import { MapPinned } from "lucide-react";

import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

import { useSelectedArea } from "@/components/area/AreaContext";
import { useLocationView } from "@/hooks/location/useLocationView";

export default function LocationView() {
  const { selectedAreaId } = useSelectedArea();

  return <LocationViewContent key={selectedAreaId ?? "no-area"} />;
}

function LocationViewContent() {
  const {
    search,
    setSearch,

    area,
    selectedAreaLabel,

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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null,
  );

  const handleAreaChange = (nextArea?: string) => {
    if (nextArea !== area) {
      setSector(undefined);
    }
  };

  const handleSectorChange = (nextSector?: string) => {
    setSector(nextSector);
  };

  const totalLocations = locations.length;
  const activeLocations = locations.filter(
    (location) => location.isActive,
  ).length;
  const inactiveLocations = totalLocations - activeLocations;

  const handleExportLocations = () => {
    exportLocationsExcel({ locations });
  };

  // Initial loading only
  if (isLoading && locations.length === 0) {
    return <LoadingState title="Loading locations..." className="min-h-100" />;
  }

  if (isError) {
    return <ErrorState title={error?.message || "Something went wrong"} />;
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <CreateLocationModal
        key={area ?? "no-area"}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Update */}
      <UpdateLocationModal
        open={!!editingLocationId}
        locationId={editingLocationId}
        onClose={() => setEditingLocationId(null)}
      />

      {/* Filters */}
      <LocationFilters
        search={search}
        onSearchChange={setSearch}
        area={area}
        selectedAreaLabel={selectedAreaLabel}
        onAreaChange={handleAreaChange}
        sector={sector}
        selectedSectorLabel={sector ? sectorLabelMap[sector] : undefined}
        onSectorChange={handleSectorChange}
        isActive={isActive}
        onStatusChange={setIsActive}
        onClearFilters={handleClearFilters}
        onCreateLocation={() => setIsCreateModalOpen(true)}
        onExportLocations={handleExportLocations}
        isFetching={isFetching}
        disabled={!!reorderSector}
        totalLocations={totalLocations}
        activeLocations={activeLocations}
        inactiveLocations={inactiveLocations}
      />

      {/* Results */}
      <div className="min-h-125">
        {locations.length === 0 && !isFetching ? (
          <EmptyState
            icon={MapPinned}
            title="No Locations Found"
            description="Try changing filters or search keyword."
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedLocations).map(([sectorId, items]) => (
              <LocationSector
                key={sectorId}
                sectorId={sectorId}
                sectorLabel={
                  sectorLabelMap[sectorId] ||
                  items[0]?.sector.name ||
                  "Unknown Sector"
                }
                items={items}
                reorderSector={reorderSector}
                reorderItems={reorderItems}
                setReorderSector={setReorderSector}
                setReorderItems={setReorderItems}
                handleSaveOrder={handleSaveOrder}
                isSavingOrder={isSavingOrder}
                onEdit={setEditingLocationId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
