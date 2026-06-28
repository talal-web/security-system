export const formatSectorName = (sector: string) => {
  return sector
    .split("_")
    .map((part) => {
      // Keep numbers as-is
      if (/^\d+$/.test(part)) return part;

      // Single letters (a, b, c) -> A, B, C
      if (/^[a-z]$/i.test(part)) return part.toUpperCase();

      // Words -> Capitalize first letter
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
};
