"use client";

import SectorSelect from "./SectorSelect";

interface SectorFilterSelectProps {
  value?: string;
  areaId?: string;
  disabled?: boolean;
  onChange: (value?: string) => void;
  className?: string;
}

export default function SectorFilterSelect({
  value,
  areaId,
  disabled = false,
  onChange,
  className,
}: SectorFilterSelectProps) {
  return (
    <SectorSelect
      showLabel={false}
      value={value ?? ""}
      areaId={areaId}
      disabled={disabled || (!areaId && !!value)}
      onChange={(event) => onChange(event.target.value || undefined)}
      placeholder={areaId ? "All Sectors" : "Select an area first"}
      wrapperClassName={className}
    />
  );
}
