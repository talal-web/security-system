"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { educationOptions, designationOptions } from "@/constants/employee";

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
import Input from "@/components/Input";
import Select from "@/components/Select";

import { Employee } from "@/types/employee";
import { calculateAge, formatDate } from "@/lib/employeeFormat";

type Props = {
  employee: Employee;
};

type FormValues = {
  name: string;
  fatherName: string;
  birthDate: string;
  cnic: string;
  address: string;
  phone1: string;
  phone2: string;
  education: string;
  designation: string;
  reference: string;
  status: string;
  entryDate: string;
  exitDate: string;
};

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();

  const { handleUpdateEmployee, loading, isError, error, isSuccess } =
    useUpdateEmployee();

  // ======================
  // RHF SETUP
  // ======================
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name: employee.name || "",
      fatherName: employee.fatherName || "",
      birthDate: employee.birthDate?.split("T")[0] || "",
      cnic: employee.cnic || "",
      address: employee.address || "",
      phone1: employee.phone1 || "",
      phone2: employee.phone2 || "",
      education: employee.education || "matric",
      designation: employee.designation || "guard",
      reference: employee.reference || "",
      status: employee.status || "active",
      entryDate: employee.entryDate?.split("T")[0] || "",
      exitDate: employee.exitDate?.split("T")[0] || "",
    },
  });

  // ======================
  // IMAGE STATE (separate)
  // ======================
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    employee.profileImage || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  const age = watch("birthDate") ? calculateAge(watch("birthDate")) : 0;

  // ======================
  // IMAGE HANDLERS
  // ======================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
    setRemoveImage(true);
  };

  // ======================
  // SUBMIT
  // ======================
  const onSubmit = async (values: FormValues) => {
    const data = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value as string);
    });

    if (profileImage) {
      data.append("profileImage", profileImage);
    }

    if (removeImage) {
      data.append("removeProfileImage", "true");
    }

    await handleUpdateEmployee({
      id: employee._id,
      employeeData: data,
    });

    router.push("/employees");
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-xl sm:rounded-[32px]">
      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
              <ShieldCheck className="h-4 w-4" />
              Employee Management
            </div>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Update Employee
            </h2>

            <p className="text-sm text-orange-100">
              Manage employee data easily and securely
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            <TopStat label="Age" value={`${age} Years`} />
            <TopStat label="Created" value={formatDate(employee.createdAt)} />
            <TopStat label="Entry" value={formatDate(watch("entryDate"))} />
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="px-4 pt-4 sm:px-8">
        {isSuccess && (
          <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            Employee updated successfully.
          </div>
        )}

        {isError && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error?.message || "Failed to update employee"}
          </div>
        )}
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 px-4 pb-6 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {/* IMAGE */}
        <div className="md:col-span-2 lg:col-span-3 flex items-center gap-5">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border bg-gray-100">
            {preview ? (
              <img
                src={preview}
                className="h-full w-full object-cover"
                alt="profile"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="w-fit cursor-pointer rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-200">
              Change Picture
              <input type="file" hidden onChange={handleImageChange} />
            </label>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="w-fit rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
            >
              Remove Picture
            </button>
          </div>
        </div>

        {/* FIELDS (NOW RHF) */}
        <Input icon={<User />} label="Name" {...register("name")} />

        <Input
          icon={<User />}
          label="Father Name"
          {...register("fatherName")}
        />

        <Input icon={<CreditCard />} label="CNIC" {...register("cnic")} />

        <Input icon={<Phone />} label="Phone 1" {...register("phone1")} />

        <Input icon={<Phone />} label="Phone 2" {...register("phone2")} />

        <Input icon={<MapPin />} label="Address" {...register("address")} />

        <Input
          icon={<BriefcaseBusiness />}
          label="Reference"
          {...register("reference")}
        />

        <Select
          icon={<GraduationCap />}
          label="Education"
          options={educationOptions}
          {...register("education")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          options={designationOptions}
          {...register("designation")}
        />

        <Input
          icon={<CalendarDays />}
          type="date"
          label="Entry Date"
          {...register("entryDate")}
        />

        <Input
          icon={<Clock3 />}
          type="date"
          label="Exit Date"
          {...register("exitDate")}
        />

        <Input
          icon={<Cake />}
          type="date"
          label="Birth Date"
          {...register("birthDate")}
        />

        <Select
          icon={<BadgeCheck />}
          label="Status"
          options={["active", "inactive"]}
          {...register("status")}
        />

        {/* SUBMIT */}
        <div className="md:col-span-2 lg:col-span-3">
          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            <Save className="h-5 w-5" />
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TopStat({ label, value }: any) {
  return (
    <div className="rounded-lg bg-white/20 p-2 text-white">
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
