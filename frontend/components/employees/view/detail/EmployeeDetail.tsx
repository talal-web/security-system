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
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]">
        {/* =========================
            HEADER
        ========================= */}

        <EmployeeHeader employee={employee} />

        {/*Quick Stats */}

        <EmployeeQuickStats employee={employee} />

        {/* =========================
            DETAILS
        ========================= */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            {/* ================= PERSONAL INFO ================= */}
            <EmployeeSection title="Personal Information" color="bg-orange-500">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

            {/* ================= CONTACT INFO ================= */}
            <EmployeeSection title="Contact Information" color="bg-blue-500">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="md:col-span-2 xl:col-span-3">
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

            {/* ================= EMPLOYMENT INFO ================= */}
            <EmployeeSection
              title="Employment Information"
              color="bg-emerald-500"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
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
