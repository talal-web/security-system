import {
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  Building2,
} from "lucide-react";

import StatCard from "./StatCard";

import type { Employee } from "@/types/employee";
import { formatText } from "@/utils/employee/employeeFormat";
import { formatSectorName } from "@/utils/formatSectorName";

interface Props {
  employee: Employee;
}

export default function EmployeeQuickStats({ employee }: Props) {
  const location =
    typeof employee.currentLocation === "string"
      ? employee.currentLocation
      : employee.currentLocation?.name;

  const sector =
    typeof employee.sector === "string"
      ? formatSectorName(employee.sector)
      : employee.sector?.name
        ? employee.sector.name
        : undefined;

  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Location"
          value={location || "—"}
          icon={<MapPin className="h-5 w-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Sector"
          value={sector || "—"}
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Designation"
          value={formatText(employee.designation)}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          iconBg="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Status"
          value={formatText(employee.status)}
          icon={<ShieldCheck className="h-5 w-5" />}
          iconBg={
            employee.status === "active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }
        />
      </div>
    </section>
  );
}
