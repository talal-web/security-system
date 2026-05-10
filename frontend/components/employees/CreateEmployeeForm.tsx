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
  Cake,
} from "lucide-react";

import { useCreateEmployee } from "@/hooks/useCreateEmployee";

import { EmployeeDesignation, EducationLevel } from "@/types/employee";

// ======================
// Options
// ======================

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

// ======================
// Format
// ======================

function formatText(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ======================
// Component
// ======================

export default function CreateEmployeeForm() {
  const router = useRouter();

  const { handleCreateEmployee, loading, success, error } = useCreateEmployee();

  // ======================
  // Form Data
  // ======================

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    birthDate: "",
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

  // ======================
  // Profile Image
  // ======================

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // ======================
  // Change Handler
  // ======================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================
  // Submit (FormData for Multer)
  // ======================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();

    // text fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // image
    if (profileImage) {
      form.append("profileImage", profileImage);
    }

    const data = await handleCreateEmployee(form);

    if (data) {
      router.push("/employees");
    }
  };

  // ======================
  // UI
  // ======================

  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Employee Management
            </div>

            <h1 className="text-3xl font-bold text-white lg:text-4xl">
              Create Employee
            </h1>

            <p className="text-sm text-orange-50 lg:text-base">
              Add employee records securely and efficiently
            </p>
          </div>

          {/* RIGHT - PROFILE IMAGE UPLOAD */}
          <label className="flex flex-col items-center gap-2 lg:items-end">
            <div className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur transition hover:bg-white/20 sm:h-32 sm:w-32">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-white">
                  <User className="h-10 w-10" />
                  <span className="text-[10px]">Upload</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              />
            </div>

            <span className="text-xs text-orange-50">Profile Image</span>
          </label>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="px-5 pt-5 sm:px-8">
        {success && (
          <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 px-5 pb-10 sm:px-8 md:grid-cols-2 lg:grid-cols-3"
      >
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
          icon={<ShieldCheck />}
          label="Designation"
          name="designation"
          value={formData.designation}
          options={designationOptions}
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
          icon={<Cake />}
          label="Birth Date"
          type="date"
          name="birthDate"
          value={formData.birthDate}
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

        <Select
          icon={<GraduationCap />}
          label="Education"
          name="education"
          value={formData.education}
          options={educationOptions}
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
          icon={<CalendarDays />}
          label="Exit Date"
          type="date"
          name="exitDate"
          value={formData.exitDate}
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

        {/* SUBMIT */}
        <div className="md:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-orange-600 font-bold text-white transition hover:bg-orange-700 disabled:opacity-70"
          >
            <Save className="h-5 w-5" />
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ======================
// INPUT
// ======================

function Input({ icon, label, ...props }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border bg-slate-50 px-4 focus-within:border-orange-500">
        <span className="text-slate-400">{icon}</span>

        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}

// ======================
// SELECT
// ======================

function Select({ icon, label, options, ...props }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border bg-slate-50 px-4 focus-within:border-orange-500">
        <span className="text-slate-400">{icon}</span>

        <select
          {...props}
          className="w-full bg-transparent text-sm capitalize outline-none"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {formatText(opt)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
