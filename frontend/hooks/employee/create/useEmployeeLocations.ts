import { useMemo } from "react";

import { useLocations } from "@/hooks/location/useLocation";

export const useEmployeeLocations = (sectorId?: string) => {
  const {
    data: locations = [],
    isLoading,
    isError,
    error,
  } = useLocations({
    sector: sectorId,
    isActive: true,
    enabled: Boolean(sectorId),
  });

  const options = useMemo(
    () =>
      locations.map((loc) => ({
        label: loc.name,
        value: loc._id,
      })),
    [locations],
  );

  const disabled = !sectorId || isLoading || isError || options.length === 0;

  const placeholder = !sectorId
    ? "Select Sector First"
    : isLoading
      ? "Loading Locations..."
      : isError
        ? "Locations Unavailable"
        : options.length === 0
          ? "No Active Locations in This Sector"
          : "Select Location";

  const statusMessage = !sectorId
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
