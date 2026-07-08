import Image from "next/image";

import { Employee } from "@/types/employee";

import { calculateAge, formatDate, formatText } from "@/utils/employeeFormat";

type Props = {
  employee: Employee;
};

export default function EmployeePrintCard({ employee }: Props) {
  const age = calculateAge(employee.birthDate);

  const currentLocation =
    typeof employee.currentLocation === "string"
      ? employee.currentLocation
      : employee.currentLocation?.name;

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-300 bg-white p-8 text-slate-900 shadow-sm">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="border-b border-slate-300 pb-6">
        <h1 className="text-center text-3xl font-bold">Employee Profile</h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Official Employee Record
        </p>
      </div>

      {/* ========================================= */}
      {/* PROFILE */}
      {/* ========================================= */}

      <div className="mt-8 flex gap-8">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-slate-300 bg-slate-100">
          {employee.profileImage ? (
            <Image
              src={employee.profileImage}
              alt={employee.name}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{formatText(employee.name)}</h2>

          <p className="mt-1 text-slate-600">
            S/O {formatText(employee.fatherName)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Info label="Employee ID" value={employee.empId} />
            <Info label="Status" value={formatText(employee.status)} />
            <Info
              label="Designation"
              value={formatText(employee.designation)}
            />
            <Info label="Current Location" value={currentLocation} />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* PERSONAL INFORMATION */}
      {/* ========================================= */}

      <SectionTitle title="Personal Information" />

      <div className="grid grid-cols-2 gap-4">
        <Info label="Full Name" value={formatText(employee.name)} />

        <Info label="Father Name" value={formatText(employee.fatherName)} />

        <Info label="CNIC" value={employee.cnic} />

        <Info label="Birth Date" value={formatDate(employee.birthDate)} />

        <Info label="Age" value={`${age} Years`} />

        <Info
          label="Education"
          value={formatText(employee.education ?? undefined)}
        />
      </div>

      {/* ========================================= */}
      {/* CONTACT INFORMATION */}
      {/* ========================================= */}

      <SectionTitle title="Contact Information" />

      <div className="grid grid-cols-2 gap-4">
        <Info label="Primary Phone" value={employee.phone1} />

        <Info label="Secondary Phone" value={employee.phone2} />

        <div className="col-span-2">
          <Info
            label="Residential Address"
            value={formatText(employee.address)}
          />
        </div>
      </div>

      {/* ========================================= */}
      {/* EMPLOYMENT INFORMATION */}
      {/* ========================================= */}

      <SectionTitle title="Employment Information" />

      <div className="grid grid-cols-2 gap-4">
        <Info label="Designation" value={formatText(employee.designation)} />

        <Info label="Current Location" value={currentLocation} />

        <Info label="Sector" value={formatText(employee.sector ?? undefined)} />

        <Info label="Status" value={formatText(employee.status)} />

        <Info
          label="Basic Salary"
          value={
            employee.basicSalary
              ? `Rs. ${employee.basicSalary.toLocaleString()}`
              : "N/A"
          }
        />

        <Info label="Entry Date" value={formatDate(employee.entryDate)} />

        <Info
          label="Exit Date"
          value={
            employee.exitDate
              ? formatDate(employee.exitDate)
              : "Currently Working"
          }
        />
      </div>

      {/* ========================================= */}
      {/* ADDITIONAL INFORMATION */}
      {/* ========================================= */}

      <SectionTitle title="Additional Information" />

      <div className="grid grid-cols-2 gap-4">
        <Info label="Reference" value={formatText(employee.reference)} />

        <Info label="Employee ID" value={employee.empId} />

        <div className="col-span-2">
          <Info label="Notes" value={employee.notes} />
        </div>
      </div>

      {/* ========================================= */}
      {/* SYSTEM INFORMATION */}
      {/* ========================================= */}

      <SectionTitle title="System Information" />

      <div className="grid grid-cols-2 gap-4">
        <Info label="Created At" value={formatDate(employee.createdAt)} />

        <Info label="Updated At" value={formatDate(employee.updatedAt)} />
      </div>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      <div className="mt-10 flex items-center justify-between border-t border-slate-300 pt-4 text-xs text-slate-500">
        <span>Employee ID: {employee.empId}</span>

        <span>Generated by Employee Management System</span>
      </div>
    </div>
  );
}

/* ========================================= */
/* SECTION TITLE */
/* ========================================= */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mt-8 mb-4">
      <h3 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
        {title}
      </h3>
    </div>
  );
}

/* ========================================= */
/* INFO CARD */
/* ========================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
}
