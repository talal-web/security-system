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
    <section>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Current Location"
          value={location || "—"}
          icon={<MapPin className="h-5 w-5" />}
          iconBg="bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100"
        />

        <StatCard
          title="Sector"
          value={sector || "—"}
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
        />

        <StatCard
          title="Designation"
          value={formatText(employee.designation)}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          iconBg="bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-100"
        />

        <StatCard
          title="Status"
          value={formatText(employee.status)}
          icon={<ShieldCheck className="h-5 w-5" />}
          iconBg={
            employee.status === "active"
              ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100"
              : "bg-red-50 text-red-600 ring-1 ring-inset ring-red-100"
          }
        />
      </div>
    </section>
  );
}
