"use client";

import { useEffect, useMemo, useState } from "react";

import { sectorOptions } from "@/constants/location";

import { useLocations } from "./useLocation";
import { useReorderLocations } from "./useReorderLocation";

import type { ILocation, LocationSector } from "@/types/location";

export function useLocationView() {
  // ==========================
  // FILTERS
  // ==========================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sector, setSector] = useState<LocationSector>();
  const [isActive, setIsActive] = useState<boolean | undefined>(true);

  // ==========================
  // REORDER
  // ==========================
  const [reorderSector, setReorderSector] = useState<LocationSector | null>(
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
      if (!acc[location.sector]) {
        acc[location.sector] = [];
      }

      acc[location.sector].push(location);

      return acc;
    }, {});
  }, [locations]);

  // ==========================
  // LABEL MAP
  // ==========================
  const sectorLabelMap = useMemo(() => {
    return sectorOptions.reduce(
      (acc, item) => {
        acc[item.value] = item.label;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, []);

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
