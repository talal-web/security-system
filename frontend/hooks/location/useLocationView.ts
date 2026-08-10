"use client";

import { useEffect, useMemo, useState } from "react";

import { useSectors } from "@/hooks/sector/useSector";

import { useLocations } from "./useLocation";
import { useReorderLocations } from "./useReorderLocation";

import type { ILocation, LocationSectorId } from "@/types/location";

export function useLocationView() {
  // ==========================
  // FILTERS
  // ==========================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sector, setSector] = useState<LocationSectorId>();
  const [isActive, setIsActive] = useState<boolean | undefined>(true);

  // ==========================
  // REORDER
  // ==========================
  const [reorderSector, setReorderSector] = useState<LocationSectorId | null>(
    null,
  );

  const [reorderItems, setReorderItems] = useState<ILocation[]>([]);

  // ==========================
  // SEARCH DEBOUNCE
  // ==========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================
  // FETCH
  // ==========================
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

  const { data: sectorResponse } = useSectors();

  // ==========================
  // REORDER MUTATION
  // ==========================
  const { mutate: reorderLocations, isPending: isSavingOrder } =
    useReorderLocations();

  // ==========================
  // GROUP BY SECTOR
  // ==========================
  const groupedLocations = useMemo(() => {
    return locations.reduce((acc: Record<string, ILocation[]>, location) => {
      const sectorId = location.sector._id;

      if (!acc[sectorId]) {
        acc[sectorId] = [];
      }

      acc[sectorId].push(location);

      return acc;
    }, {});
  }, [locations]);

  // ==========================
  // LABEL MAP
  // ==========================
  const sectorLabelMap = useMemo(() => {
    const sectors = sectorResponse?.data ?? [];

    return sectors.reduce(
      (acc, currentSector) => {
        acc[currentSector._id] = currentSector.name;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [sectorResponse]);

  // ==========================
  // SAVE ORDER
  // ==========================
  const handleClearFilters = () => {
    setSearch("");
    setSector(undefined);
    setIsActive(undefined);
  };

  const handleSaveOrder = () => {
    if (!reorderSector) return;

    reorderLocations(
      {
        sector: reorderSector,

        locations: reorderItems.map((location, index) => ({
          _id: location._id,
          sortOrder: index + 1,
        })),
      },
      {
        onSuccess: () => {
          setReorderSector(null);
        },
      },
    );
  };

  return {
    // filters
    search,
    setSearch,

    sector,
    setSector,

    isActive,
    setIsActive,
    handleClearFilters,

    // query
    locations,
    groupedLocations,

    isLoading,
    isFetching,
    isError,
    error,

    // reorder
    reorderSector,
    setReorderSector,

    reorderItems,
    setReorderItems,

    handleSaveOrder,
    isSavingOrder,

    // utils
    sectorLabelMap,
  };
}
