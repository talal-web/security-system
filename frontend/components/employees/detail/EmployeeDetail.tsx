import { Employee } from "@/types/employee";

import {
  CalendarClock,
  CalendarDays,
  Cake,
  Clock3,
  CreditCard,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import EmployeeHeader from "./EmployeeHeader";
import EmployeeInfoCard from "./EmployeeInfoCard";

import { formatDate, formatText } from "../EmployeeFormat";

type Props = {
  employee: Employee;
};

export default function EmployeeDetail({ employee }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <EmployeeHeader employee={employee} />

        {/* DETAILS GRID */}
        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3 sm:p-8">
          <EmployeeInfoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="CNIC Number"
            value={employee.cnic}
          />

          <EmployeeInfoCard
            icon={<Phone className="h-5 w-5" />}
            label="Primary Phone"
            value={employee.phone1}
          />

          <EmployeeInfoCard
            icon={<Phone className="h-5 w-5" />}
            label="Secondary Phone"
            value={employee.phone2 || "Not Available"}
          />

          <EmployeeInfoCard
            icon={<MapPin className="h-5 w-5" />}
            label="Residential Address"
            value={formatText(employee.address)}
          />

          <EmployeeInfoCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Designation"
            value={formatText(employee.designation)}
          />

          <EmployeeInfoCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Education"
            value={formatText(employee.education)}
          />

          <EmployeeInfoCard
            icon={<Cake className="h-5 w-5" />}
            label="Birth Date"
            value={formatDate(employee.birthDate)}
          />

          <EmployeeInfoCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Entry Date"
            value={formatDate(employee.entryDate)}
          />

          <EmployeeInfoCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Exit Date"
            value={
              employee.exitDate
                ? formatDate(employee.exitDate)
                : "Currently Working"
            }
          />

          <EmployeeInfoCard
            icon={<CalendarClock className="h-5 w-5" />}
            label="Created At"
            value={formatDate(employee.createdAt)}
          />

          <EmployeeInfoCard
            icon={<User className="h-5 w-5" />}
            label="Reference"
            value={formatText(employee.reference)}
          />
        </div>

        {/* NOTES */}
        {employee.notes && (
          <div className="border-t border-slate-200 px-6 py-6 sm:px-8">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Additional Notes
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {employee.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
