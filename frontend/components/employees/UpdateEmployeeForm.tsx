// src/components/employees/UpdateEmployeeForm.tsx

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  User,
  Phone,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  MapPin,
  CreditCard,
  Save,
  BadgeCheck,
  BriefcaseBusiness,
} from "lucide-react";

import { useUpdateEmployee } from "@/hooks/useUpdateEmployee";

import {
  Employee,
  EmployeeDesignation,
  EducationLevel,
} from "@/types/employee";

type Props = {
  employee: Employee;
};

const educationOptions: EducationLevel[] = [
  "nil",
  "middle",
  "matric",
  "fsc",
  "intermediate",
  "bs",
  "master",
];

const designationOptions: EmployeeDesignation[] = [
  "guard",
  "army guard",
  "asst supervisor",
  "supervisor",
  "mcr",
  "driver",
  "clerk",
];

function formatText(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();

  const { handleUpdateEmployee, loading, success, error } = useUpdateEmployee();

  const [formData, setFormData] = useState({
    name: employee.name || "",
    fatherName: employee.fatherName || "",
    age: employee.age || 18,
    cnic: employee.cnic || "",
    address: employee.address || "",
    phone1: employee.phone1 || "",
    phone2: employee.phone2 || "",
    education: (employee.education as EducationLevel) || "matric",
    designation: (employee.designation as EmployeeDesignation) || "guard",
    reference: employee.reference || "",
    status: employee.status || "active",
    entryDate: employee.entryDate ? employee.entryDate.split("T")[0] : "",
    exitDate: employee.exitDate ? employee.exitDate.split("T")[0] : "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = await handleUpdateEmployee(employee._id, formData);

    if (data) {
      router.push("/employees");
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Employee Management
            </div>

            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Update Employee
            </h2>

            <p className="mt-3 text-sm leading-6 text-orange-100 sm:text-base">
              Update and manage employee information securely.
            </p>
          </div>

          <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur md:flex">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-6 pt-6 sm:px-10">
        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 px-6 pb-8 sm:px-10 lg:grid-cols-2"
      >
        <InputField
          icon={<User className="h-5 w-5" />}
          label="Employee Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          icon={<User className="h-5 w-5" />}
          label="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />

        <InputField
          icon={<BriefcaseBusiness className="h-5 w-5" />}
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />

        <InputField
          icon={<CreditCard className="h-5 w-5" />}
          label="CNIC"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
        />

        <InputField
          icon={<Phone className="h-5 w-5" />}
          label="Primary Phone"
          name="phone1"
          value={formData.phone1}
          onChange={handleChange}
        />

        <InputField
          icon={<Phone className="h-5 w-5" />}
          label="Secondary Phone"
          name="phone2"
          value={formData.phone2}
          onChange={handleChange}
        />

        <InputField
          icon={<MapPin className="h-5 w-5" />}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <InputField
          icon={<User className="h-5 w-5" />}
          label="Reference"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />

        <SelectField
          icon={<GraduationCap className="h-5 w-5" />}
          label="Education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          options={educationOptions}
        />

        <SelectField
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          options={designationOptions}
        />

        <SelectField
          icon={<BadgeCheck className="h-5 w-5" />}
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={["active", "inactive"]}
        />

        <InputField
          icon={<CalendarDays className="h-5 w-5" />}
          label="Entry Date"
          name="entryDate"
          type="date"
          value={formData.entryDate}
          onChange={handleChange}
        />

        <InputField
          icon={<CalendarDays className="h-5 w-5" />}
          label="Exit Date"
          name="exitDate"
          type="date"
          value={formData.exitDate}
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:scale-[1.01] hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-5 w-5" />

            {loading ? "Updating Employee..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

type InputFieldProps = {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-all duration-300 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-lg">
        <div className="text-slate-400">{icon}</div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
        />
      </div>
    </div>
  );
}

type SelectFieldProps = {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SelectField({
  icon,
  label,
  name,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-all duration-300 focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-lg">
        <div className="text-slate-400">{icon}</div>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm font-medium capitalize text-slate-900 outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {formatText(option)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
