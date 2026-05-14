// components/employees/detail/employeeHelpers.ts

// ======================================
// Format Text
// ======================================

export function formatText(text?: string) {
  if (!text) return "Not Available";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ======================================
// Format Date
// ======================================

export function formatDate(date?: string | null) {
  if (!date) return "Not Available";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid Date";

  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
// ======================================
// Calculate Age
// ======================================

export function calculateAge(birthDate: string) {
  const today = new Date();

  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}
