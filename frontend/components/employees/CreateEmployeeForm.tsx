"use client";

import { toast } from "sonner";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Input from "@/components/Input";
import Select from "@/components/Select";

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
  Banknote,
} from "lucide-react";

import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
import { useLocations } from "@/hooks/location/useLocation"; // 🔥 ADD THIS

import { z } from "zod";
import { employeeSchema } from "@/lib/employeeSchema";

import { educationOptions, designationOptions } from "@/constants/employee";

import { sectorOptions } from "@/constants/location";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function CreateEmployeeForm() {
  const router = useRouter();

  const { data: locations = [] } = useLocations(); // 🔥 GET LOCATIONS

  const { handleCreateEmployee, loading, isSuccess, error } = useCreateEmployee(
    {
      onSuccess: () => {
        toast.success("Employee created successfully");
        router.push("/employees");
      },
      onError: (message) => {
        toast.error(message);
      },
    },
  );

  const [profileImage, setProfileImage] = useState<File | null>(null);

  // ======================
  // React Hook Form
  // ======================
  const {
    register,
    handleSubmit,
    watch,
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
      sector: "zone_1_a",
      currentLocation: "",
      basicSalary: 0,
      reference: "",
      status: "active",
      entryDate: "",
      exitDate: "",
    },
  });

  // 🔥 watch sector for filtering locations
  const selectedSector = watch("sector");

  // ======================
  // Filter locations by sector
  // ======================
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => loc.sector === selectedSector);
  }, [locations, selectedSector]);

  // ======================
  // Submit
  // ======================
  const onSubmit = async (values: EmployeeFormValues) => {
    const form = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      form.append(key, String(value ?? ""));
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
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

          {/* PROFILE IMAGE */}
          <label className="flex flex-col items-center gap-2 lg:items-end">
            <div className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-white/30 bg-white/10 backdrop-blur">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
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
          </label>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 px-5 pb-10 sm:px-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <Input icon={<User />} label="Name" {...register("name")} />
        <Input
          icon={<User />}
          label="Father Name"
          {...register("fatherName")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          options={designationOptions}
          {...register("designation")}
        />

        <Input icon={<CreditCard />} label="CNIC" {...register("cnic")} />

        <Input
          type="date"
          icon={<Cake />}
          label="Birth Date"
          {...register("birthDate")}
        />

        <Input icon={<MapPin />} label="Address" {...register("address")} />

        <Input icon={<Phone />} label="Phone 1" {...register("phone1")} />
        <Input icon={<Phone />} label="Phone 2" {...register("phone2")} />

        <Select
          icon={<GraduationCap />}
          label="Education"
          options={educationOptions}
          {...register("education")}
        />

        {/* SECTOR */}
        <Select
          icon={<MapPin />}
          label="Sector"
          options={sectorOptions}
          {...register("sector")}
        />

        {/* 🔥 CURRENT LOCATION (FILTERED BY SECTOR) */}
        <Select
          icon={<MapPin />}
          label="Current Location"
          options={filteredLocations.map((loc) => ({
            label: loc.name,
            value: loc._id,
          }))}
          error={errors.currentLocation?.message}
          {...register("currentLocation")}
        />

        <Input
          type="date"
          icon={<CalendarDays />}
          label="Entry Date"
          {...register("entryDate")}
        />
        <Input
          type="date"
          icon={<CalendarDays />}
          label="Exit Date"
          {...register("exitDate")}
        />

        <Input icon={<User />} label="Reference" {...register("reference")} />

        <Input
          icon={<Banknote />}
          type="number"
          label="Basic Salary"
          {...register("basicSalary", { valueAsNumber: true })}
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
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-orange-600 font-bold text-white"
          >
            <Save className="h-5 w-5" />
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
