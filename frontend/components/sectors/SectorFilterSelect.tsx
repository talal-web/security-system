"use client";

import SectorSelect from "./SectorSelect";

interface SectorFilterSelectProps {
  value?: string;
  disabled?: boolean;
  onChange: (value?: string) => void;
  className?: string;
}

export default function SectorFilterSelect({
  value,
  disabled = false,
  onChange,
  className,
}: SectorFilterSelectProps) {
  return (
    <SectorSelect
      showLabel={false}
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value || undefined)}
      placeholder="All Sectors"
      wrapperClassName={className}
    />
  );
}
