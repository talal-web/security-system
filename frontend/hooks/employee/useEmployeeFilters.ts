import { useState } from "react";

import { EmployeeFilters } from "@/types/employee-filters";

export const initialFilters: EmployeeFilters = {
  search: "",
  status: "",
  designation: "",
  sector: "",
  defaultShift: "",
};

export function useEmployeeFilters() {
  const [filters, setFilters] = useState<EmployeeFilters>(initialFilters);

  const [tempFilters, setTempFilters] =
    useState<EmployeeFilters>(initialFilters);

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setTempFilters(initialFilters);
  };

  const removeFilter = (key: keyof EmployeeFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));

    setTempFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && Boolean(value),
  ).length;

  return {
    filters,
    tempFilters,

    setFilters,
    setTempFilters,

    showFilters,
    setShowFilters,

    applyFilters,
    clearFilters,
    removeFilter,

    activeFilterCount,
  };
}
