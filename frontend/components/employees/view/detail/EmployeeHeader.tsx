import Image from "next/image";
import { User, BriefcaseBusiness, MapPin } from "lucide-react";

import EmployeeActions from "./EmployeeActions";
import StatusBadge from "./StatusBadge";
import Tag from "./Tag";

import { Employee } from "@/types/employee";
import { formatText } from "@/utils/employee/employeeFormat";

interface EmployeeHeaderProps {
  employee: Employee;
}

export default function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  return (
    <header className="rounded-xl border border-slate-200/80 bg-white shadow-card">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
          {/* Avatar */}
          <div className="flex justify-center sm:block">
            <div className="relative size-20 overflow-hidden rounded-full border border-slate-200 bg-slate-100 sm:size-24">
              {employee.profileImage ? (
                <Image
                  src={employee.profileImage}
                  alt={employee.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="144px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="size-9 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h1 className="text-center text-xl font-semibold tracking-tight text-slate-900 sm:text-left sm:text-2xl">
              {formatText(employee.name)}
            </h1>

            <p className="mt-0.5 text-center text-sm text-slate-500 sm:text-left">
              S/O {formatText(employee.fatherName)}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Tag icon={<User className="h-4 w-4" />} text={employee.empId} />

              <Tag
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                text={formatText(employee.designation)}
              />

              <Tag
                icon={<MapPin className="h-4 w-4" />}
                text={
                  typeof employee.currentLocation === "string"
                    ? employee.currentLocation
                    : employee.currentLocation?.name
                }
              />

              <StatusBadge status={employee.status} />
            </div>

            <EmployeeActions employee={employee} />
          </div>
        </div>
      </div>
    </header>
  );
}
