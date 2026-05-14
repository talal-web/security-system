"use client";
import { toast } from "sonner";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import Select from "@/components/Select";

import Image from "next/image";

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

import { z } from "zod";

import { employeeSchema } from "@/lib/employeeSchema";
import { educationOptions } from "@/constants/employee";
import { designationOptions } from "@/constants/employee";
import { formatText } from "@/lib/employeeFormat";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

// ======================
// Component
// ======================

export default function CreateEmployeeForm() {
  const router = useRouter();

  const { handleCreateEmployee, loading, isSuccess, isError, error } =
    useCreateEmployee({
      onSuccess: () => {
        toast.success("Employee created successfully");
        router.push("/employees");
      },

      onError: (message) => {
        toast.error(message);
      },
    });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // ======================
  // React Hook Form
  // ======================

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),

    defaultValues: {
      name: "",
      fatherName: "",
      birthDate: "",
      cnic: "",
      address: "",
      phone1: "",
      phone2: "",
      education: "matric",
      designation: "guard",
      reference: "",
      status: "active",
      entryDate: "",
      exitDate: "",
    },
  });

  // ======================
  // Submit
  // ======================

  const onSubmit = async (values: EmployeeFormValues) => {
    const form = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      form.append(key, value ?? "");
    });

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

          {/* RIGHT */}

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
        {isSuccess && (
          <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {isSuccess}
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
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 px-5 pb-10 sm:px-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <Input
          icon={<User />}
          label="Name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          icon={<User />}
          label="Father Name"
          error={errors.fatherName?.message}
          {...register("fatherName")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          options={designationOptions}
          error={errors.designation?.message}
          {...register("designation")}
        />

        <Input
          icon={<CreditCard />}
          label="CNIC"
          error={errors.cnic?.message}
          {...register("cnic")}
        />

        <Input
          icon={<Cake />}
          type="date"
          label="Birth Date"
          error={errors.birthDate?.message}
          {...register("birthDate")}
        />

        <Input
          icon={<MapPin />}
          label="Address"
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          icon={<Phone />}
          label="Phone 1"
          error={errors.phone1?.message}
          {...register("phone1")}
        />

        <Input
          icon={<Phone />}
          label="Phone 2"
          error={errors.phone2?.message}
          {...register("phone2")}
        />

        <Select
          icon={<GraduationCap />}
          label="Education"
          options={educationOptions}
          error={errors.education?.message}
          {...register("education")}
        />

        <Input
          icon={<CalendarDays />}
          type="date"
          label="Entry Date"
          error={errors.entryDate?.message}
          {...register("entryDate")}
        />

        <Input
          icon={<CalendarDays />}
          type="date"
          label="Exit Date"
          error={errors.exitDate?.message}
          {...register("exitDate")}
        />
        <Input
          icon={<User />}
          label="Reference"
          error={errors.reference?.message}
          {...register("reference")}
        />

        <Select
          icon={<BadgeCheck />}
          label="Status"
          options={["active", "inactive"]}
          error={errors.status?.message}
          {...register("status")}
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
