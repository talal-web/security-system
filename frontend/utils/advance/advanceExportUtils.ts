import type { Advance, AdvanceFilters } from "@/types/advance";

export function formatAdvanceDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getAdvanceEmployeeName(advance: Advance) {
  if (typeof advance.employee === "string") {
    return "Employee";
  }

  return advance.employee.name;
}

export function getAdvanceFatherName(advance: Advance) {
  if (typeof advance.employee === "string") {
    return "—";
  }

  return advance.employee.fatherName || "—";
}

export function getAdvanceEmployeeId(advance: Advance) {
  if (typeof advance.employee === "string") {
    return "—";
  }

  return advance.employee.empId || "—";
}

export function getAdvanceCreatedBy(advance: Advance) {
  if (typeof advance.createdBy === "string") {
    return "—";
  }

  return advance.createdBy.name || "—";
}

export function getAdvanceDeductedAmount(advance: Advance) {
  return advance.amount - advance.remainingAmount;
}

export function getAdvanceStatusLabel(status: Advance["status"]) {
  const statusMap: Record<Advance["status"], string> = {
    active: "Active",
    partially_deducted: "Partially Deducted",
    fully_deducted: "Fully Deducted",
    cancelled: "Cancelled",
  };

  return statusMap[status] ?? status;
}

export function getAdvanceSummary(advances: Advance[]) {
  const activeAdvances = advances.filter(
    (advance) =>
      advance.status === "active" || advance.status === "partially_deducted",
  );

  const uniqueEmployees = new Set(
    advances.map((advance) =>
      typeof advance.employee === "string"
        ? advance.employee
        : advance.employee._id,
    ),
  ).size;

  const totalAmount = advances.reduce(
    (total, advance) => total + advance.amount,
    0,
  );

  const totalDeducted = advances.reduce(
    (total, advance) => total + getAdvanceDeductedAmount(advance),
    0,
  );

  const totalOutstanding = activeAdvances.reduce(
    (total, advance) => total + advance.remainingAmount,
    0,
  );

  return {
    activeAdvances,
    uniqueEmployees,
    totalAmount,
    totalDeducted,
    totalOutstanding,
  };
}

export function getAdvanceFilterDescription(filters: AdvanceFilters) {
  const parts: string[] = [];

  if (filters.search?.trim()) {
    parts.push(`Search: ${filters.search.trim()}`);
  }

  if (filters.status) {
    parts.push(`Status: ${getAdvanceStatusLabel(filters.status)}`);
  }

  if (filters.fromDate) {
    parts.push(`From: ${formatAdvanceDate(filters.fromDate)}`);
  }

  if (filters.toDate) {
    parts.push(`To: ${formatAdvanceDate(filters.toDate)}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "Default date range";
}
