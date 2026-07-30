import { useMemo } from "react";

import { useLocations } from "@/hooks/location/useLocation";
import type { LocationSector } from "@/types/location";

const LOCATION_SECTORS: readonly LocationSector[] = [
  "zone_1_a",
  "zone_1_b",
  "zone_1_c",
  "zone_1_d",
  "rawalpindi",
];

export const useEmployeeLocations = (sector?: string) => {
  const normalizedSector = LOCATION_SECTORS.includes(sector as LocationSector)
    ? (sector as LocationSector)
    : undefined;

  const {
    data: locations = [],
    isLoading,
    isError,
    error,
  } = useLocations({
    sector: normalizedSector,
    isActive: true,
    enabled: Boolean(normalizedSector),
  });

  const options = useMemo(
    () =>
      locations.map((loc) => ({
        label: loc.name,
        value: loc._id,
      })),
    [locations],
  );

  const disabled = !sector || isLoading || isError || options.length === 0;

  const placeholder = !sector
    ? "Select Sector First"
    : isLoading
      ? "Loading Locations..."
      : isError
        ? "Locations Unavailable"
        : options.length === 0
          ? "No Active Locations in This Sector"
          : "Select Location";

  const statusMessage = !sector
    ? "Select a sector to load available locations."
    : isLoading
      ? "Loading available locations..."
      : isError
        ? error instanceof Error
          ? error.message
          : "Unable to load locations right now."
        : options.length === 0
          ? "No active locations found for the selected sector."
          : "";

  return {
    options,
    disabled,
    placeholder,
    statusMessage,
    isLoading,
  };
};
