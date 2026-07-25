import {
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  Building2,
} from "lucide-react";

import StatCard from "./StatCard";

import { Employee } from "@/types/employee";
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

  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          title="Current Location"
          value={location}
          icon={<MapPin className="h-5 w-5" />}
          iconBg="bg-blue-600"
        />

        <StatCard
          title="Sector"
          value={
            employee.sector ? formatSectorName(employee.sector) : undefined
          }
          icon={<Building2 className="h-5 w-5" />}
          iconBg="bg-indigo-600"
        />

        <StatCard
          title="Designation"
          value={formatText(employee.designation)}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          iconBg="bg-violet-600"
        />

        <StatCard
          title="Status"
          value={formatText(employee.status)}
          icon={<ShieldCheck className="h-5 w-5" />}
          iconBg={
            employee.status === "active" ? "bg-emerald-600" : "bg-red-600"
          }
        />
      </div>
    </section>
  );
}
