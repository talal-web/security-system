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
    <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-slate-400 blur-3xl" />
      </div>

      <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* Avatar */}
          <div className="flex justify-center lg:block">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/15 bg-white/10 shadow-2xl lg:h-36 lg:w-36">
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
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white lg:text-left lg:text-4xl">
              {formatText(employee.name)}
            </h1>

            <p className="mt-2 text-center text-slate-300 lg:text-left">
              S/O {formatText(employee.fatherName)}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
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
    </div>
  );
}
