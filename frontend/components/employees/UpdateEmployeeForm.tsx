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
  Cake,
  Clock3,
} from "lucide-react";

import { useUpdateEmployee } from "@/hooks/useUpdateEmployee";

import {
  Employee,
  EmployeeDesignation,
  EducationLevel,
} from "@/types/employee";

import {
  calculateAge,
  formatDate,
  formatText,
} from "@/components/employees/EmployeeFormat";

type Props = {
  employee: Employee;
};

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();
  const { handleUpdateEmployee, loading, success, error } = useUpdateEmployee();

  // ======================
  // PROFILE IMAGE STATE
  // ======================
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    employee.profileImage || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  // ======================
  // FORM STATE
  // ======================
  const [formData, setFormData] = useState({
    name: employee.name || "",
    fatherName: employee.fatherName || "",
    birthDate: employee.birthDate ? employee.birthDate.split("T")[0] : "",
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

  // ======================
  // IMAGE CHANGE
  // ======================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  // ======================
  // REMOVE IMAGE
  // ======================
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
    setRemoveImage(true);
  };

  // ======================
  // INPUT CHANGE
  // ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });

    if (profileImage) {
      data.append("profileImage", profileImage);
    }

    if (removeImage) {
      data.append("removeProfileImage", "true");
    }

    const result = await handleUpdateEmployee(employee._id, data);

    if (result) router.push("/employees");
  };

  const age = formData.birthDate ? calculateAge(formData.birthDate) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-xl sm:rounded-[32px]">
      {/* ================= HEADER ================= */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
              <ShieldCheck className="h-4 w-4" />
              Employee Management
            </div>

            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Update Employee
            </h2>

            <p className="text-sm text-orange-100 sm:text-base">
              Manage employee data easily and securely
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <TopStat label="Age" value={`${age} Years`} />
            <TopStat label="Created" value={formatDate(employee.createdAt)} />
            <TopStat label="Entry" value={formatDate(formData.entryDate)} />
          </div>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="px-4 pt-4 sm:px-8">
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 px-4 pb-6 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {/* ================= PROFILE IMAGE ================= */}
        <div className="md:col-span-2 lg:col-span-3 flex items-center gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <User className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {/* CHANGE */}
            <label className="cursor-pointer rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-200 w-fit">
              Change Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {/* REMOVE */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 w-fit"
            >
              Remove Picture
            </button>

            <p className="text-xs text-gray-500">JPG, PNG or WEBP</p>
          </div>
        </div>

        {/* ================= FIELDS ================= */}
        <Input
          icon={<User />}
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          icon={<User />}
          label="Father Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />

        <Select
          icon={<BadgeCheck />}
          label="Status"
          name="status"
          value={formData.status}
          options={["active", "inactive"]}
          onChange={handleChange}
        />

        <Input
          icon={<CreditCard />}
          label="CNIC"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
        />

        <Input
          icon={<Phone />}
          label="Phone 1"
          name="phone1"
          value={formData.phone1}
          onChange={handleChange}
        />

        <Input
          icon={<Phone />}
          label="Phone 2"
          name="phone2"
          value={formData.phone2}
          onChange={handleChange}
        />

        <Input
          icon={<MapPin />}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <Input
          icon={<User />}
          label="Reference"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />

        <Input
          icon={<BriefcaseBusiness />}
          label="Age"
          value={`${age} Years`}
          disabled
        />

        <Input
          icon={<Cake />}
          label="Birth Date"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />

        <Select
          icon={<GraduationCap />}
          label="Education"
          name="education"
          value={formData.education}
          options={[
            "nil",
            "middle",
            "matric",
            "fsc",
            "intermediate",
            "bs",
            "master",
          ]}
          onChange={handleChange}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          name="designation"
          value={formData.designation}
          options={[
            "guard",
            "army guard",
            "asst supervisor",
            "supervisor",
            "mcr",
            "driver",
            "clerk",
          ]}
          onChange={handleChange}
        />

        <Input
          icon={<CalendarDays />}
          label="Entry Date"
          type="date"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
        />

        <Input
          icon={<Clock3 />}
          label="Exit Date"
          type="date"
          name="exitDate"
          value={formData.exitDate}
          onChange={handleChange}
        />

        {/* ================= SUBMIT ================= */}
        <div className="md:col-span-2 lg:col-span-3">
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60 sm:py-5"
          >
            <Save className="h-5 w-5" />
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Input({ icon, label, ...props }: any) {
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-orange-500 focus-within:bg-white">
        <span className="text-gray-400">{icon}</span>

        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}

function Select({ icon, label, options, ...props }: any) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-orange-500 focus-within:bg-white">
        <span className="text-gray-400">{icon}</span>

        <select
          {...props}
          className="w-full bg-transparent text-sm outline-none"
        >
          {options.map((o: string) => (
            <option key={o} value={o}>
              {formatText(o)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function TopStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/20 p-2 text-white backdrop-blur sm:p-3">
      <p className="text-[10px] uppercase opacity-80 sm:text-xs">{label}</p>
      <p className="text-xs font-bold sm:text-sm">{value}</p>
    </div>
  );
}
