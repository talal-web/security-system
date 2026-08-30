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
    <header className="border-b border-slate-200 bg-white">
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* Avatar */}
          <div className="flex justify-center lg:block">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-sm sm:h-28 sm:w-28">
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
                  <User className="h-10 w-10 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-left">
              {formatText(employee.name)}
            </h1>

            <p className="mt-1 text-center text-sm text-slate-500 lg:text-left">
              S/O {formatText(employee.fatherName)}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
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
