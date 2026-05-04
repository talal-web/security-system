// src/components/employees/CreateEmployeeForm.tsx

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useCreateEmployee } from "@/hooks/useCreateEmployee";

import { EmployeeDesignation, EducationLevel } from "@/types/employee";

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

export default function CreateEmployeeForm() {
  const router = useRouter();

  const { handleCreateEmployee, loading, success, error } = useCreateEmployee();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    age: 18,
    cnic: "",
    address: "",
    phone1: "",
    phone2: "",
    education: "matric" as EducationLevel,
    designation: "guard" as EmployeeDesignation,
    reference: "",
    status: "active",
    entryDate: "",
    exitDate: "",
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

    const data = await handleCreateEmployee(formData);

    if (data) {
      router.push("/employees");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">Create Employee</h2>

        <p className="mt-2 text-slate-500">
          Add new employee details to Baidar Security Service.
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 rounded-2xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Employee Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />

        <InputField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />

        <InputField
          label="CNIC"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
        />

        <InputField
          label="Phone 1"
          name="phone1"
          value={formData.phone1}
          onChange={handleChange}
        />

        <InputField
          label="Phone 2"
          name="phone2"
          value={formData.phone2}
          onChange={handleChange}
        />

        <InputField
          label="Reference"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />

        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        {/* Education */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Education
          </label>

          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
          >
            {educationOptions.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Designation
          </label>

          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
          >
            {designationOptions.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
          >
            <option value="active">Active</option>

            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Entry Date */}
        <InputField
          label="Entry Date"
          name="entryDate"
          type="date"
          value={formData.entryDate}
          onChange={handleChange}
        />

        {/* Exit Date */}
        <InputField
          label="Exit Date"
          name="exitDate"
          type="date"
          value={formData.exitDate}
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Employee..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

function InputField({
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

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500"
      />
    </div>
  );
}
