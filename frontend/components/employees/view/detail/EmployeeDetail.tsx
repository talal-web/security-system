import InfoCard from "./InfoCard";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeSection from "./EmployeeSection";
import EmployeeQuickStats from "./EmployeeQuickStats";

import {
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  Cake,
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  Banknote,
  User,
} from "lucide-react";

import { Employee } from "@/types/employee";

import {
  calculateAge,
  formatDate,
  formatText,
} from "@/utils/employee/employeeFormat";
import { formatSectorName } from "@/utils/formatSectorName";

type Props = {
  employee: Employee;
};

export default function EmployeeDetail({ employee }: Props) {
  const age = calculateAge(employee.birthDate);

  return (
    <div className="mx-auto w-full max-w-7xl px-0 py-3 sm:px-2 sm:py-4 lg:px-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:rounded-3xl">
        {/* Header */}
        <EmployeeHeader employee={employee} />

        {/* Quick Stats */}
        <EmployeeQuickStats employee={employee} />

        {/* Details */}
        <div className="p-2 sm:p-5 lg:p-7">
          <div className="space-y-6 lg:space-y-8">
            {/* ================= PERSONAL ================= */}
            <EmployeeSection title="Personal Information" color="bg-orange-500">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  icon={<CreditCard className="h-5 w-5" />}
                  label="CNIC Number"
                  value={employee.cnic}
                />

                <InfoCard
                  icon={<Cake className="h-5 w-5" />}
                  label="Birth Date"
                  value={formatDate(employee.birthDate)}
                />

                <InfoCard
                  icon={<Cake className="h-5 w-5" />}
                  label="Age"
                  value={`${age} Years`}
                />

                <InfoCard
                  icon={<User className="h-5 w-5" />}
                  label="Reference"
                  value={formatText(employee.reference)}
                />
              </div>
            </EmployeeSection>

            {/* ================= CONTACT ================= */}
            <EmployeeSection title="Contact Information" color="bg-blue-500">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="sm:col-span-2 xl:col-span-3">
                  <InfoCard
                    icon={<MapPin className="h-5 w-5" />}
                    label="Residential Address"
                    value={formatText(employee.address)}
                    large
                  />
                </div>

                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Primary Phone"
                  value={employee.phone1}
                />

                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Secondary Phone"
                  value={employee.phone2}
                />
              </div>
            </EmployeeSection>

            {/* ================= EMPLOYMENT ================= */}
            <EmployeeSection
              title="Employment Information"
              color="bg-emerald-500"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Sector"
                  value={
                    employee.sector
                      ? formatSectorName(employee.sector)
                      : undefined
                  }
                />

                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  label="Current Location"
                  value={
                    typeof employee.currentLocation === "string"
                      ? employee.currentLocation
                      : employee.currentLocation?.name
                  }
                />

                <InfoCard
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  label="Designation"
                  value={formatText(employee.designation)}
                />

                <InfoCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  label="Education"
                  value={formatText(employee.education ?? undefined)}
                />

                <InfoCard
                  icon={<Banknote className="h-5 w-5" />}
                  label="Basic Salary"
                  value={
                    employee.basicSalary
                      ? `Rs. ${employee.basicSalary.toLocaleString()}`
                      : undefined
                  }
                />

                <InfoCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Status"
                  value={formatText(employee.status)}
                />

                <InfoCard
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Entry Date"
                  value={formatDate(employee.entryDate)}
                />

                <InfoCard
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Exit Date"
                  value={
                    employee.exitDate
                      ? formatDate(employee.exitDate)
                      : "Currently Working"
                  }
                />
              </div>
            </EmployeeSection>

            {/* ================= NOTES ================= */}
            {employee.notes && (
              <EmployeeSection title="Additional Notes" color="bg-slate-900">
                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 sm:leading-7">
                    {employee.notes}
                  </p>
                </div>
              </EmployeeSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
