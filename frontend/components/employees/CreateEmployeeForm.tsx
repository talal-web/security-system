"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm, useWatch } from "react-hook-form";

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
  Clock3,
} from "lucide-react";

import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
import { useLocations } from "@/hooks/location/useLocation";

import { employeeSchema } from "@/utils/employee/employeeSchema";
import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeShift,
  SectorOptions,
} from "@/types/employee";

import { educationOptions, designationOptions } from "@/constants/employee";

import { sectorOptions } from "@/constants/location";
import { shiftOptions } from "@/constants/shiftOptions";

type EmployeeFormValues = {
  name: string;
  fatherName: string;
  birthDate: string;
  cnic: string;
  address: string;
  phone1: string;
  phone2: string;
  education?: EducationLevel | "";
  designation: EmployeeDesignation;
  sector?: SectorOptions | "";
  currentLocation?: string;
  defaultShift?: EmployeeShift | "";
  basicSalary?: number;
  reference: string;
  status: "active" | "inactive";
  entryDate: string;
  exitDate: string;
};

export default function CreateEmployeeForm() {
  const router = useRouter();

  const { data: locations = [] } = useLocations();

  const { handleCreateEmployee, loading } = useCreateEmployee({
    onSuccess: () => {
      toast.success("Employee created successfully");
      router.push("/employees");
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeFormValues>,
    defaultValues: {
      name: "",
      fatherName: "",
      birthDate: "",
      cnic: "",
      address: "",
      phone1: "",
      phone2: "",
      education: "",
      designation: "guard",
      defaultShift: "",
      sector: "",
      currentLocation: "",
      basicSalary: 0,
      reference: "",
      status: "active",
      entryDate: "",
      exitDate: "",
    },
  });

  const selectedSector = useWatch({
    control,
    name: "sector",
  });

  const profilePreviewUrl = useMemo(() => {
    return profileImage ? URL.createObjectURL(profileImage) : null;
  }, [profileImage]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  const filteredLocations = useMemo(() => {
    return locations.filter(
      (loc) => loc.isActive && loc.sector === selectedSector,
    );
  }, [locations, selectedSector]);

  const onSubmit = async (values: EmployeeFormValues) => {
    const form = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        form.append(key, String(value));
      }
    });

    if (profileImage) {
      form.append("profileImage", profileImage);
    }

    const data = await handleCreateEmployee(form);

    if (data) {
      router.push("/employees");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
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
              {profilePreviewUrl ? (
                <Image
                  src={profilePreviewUrl}
                  alt="Selected employee profile preview"
                  fill
                  unoptimized
                  className="object-cover"
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
        <Input
          icon={<User />}
          label="Name"
          placeholder="Talal Malik"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          icon={<User />}
          label="Father Name"
          placeholder="Father Name"
          error={errors.fatherName?.message}
          {...register("fatherName")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          placeholder="Select Designation"
          options={designationOptions}
          error={errors.designation?.message}
          {...register("designation")}
        />

        <Input
          icon={<CreditCard />}
          label="CNIC"
          placeholder="13302-3475226-5"
          error={errors.cnic?.message}
          {...register("cnic")}
        />

        <Input
          type="date"
          icon={<Cake />}
          label="Birth Date"
          error={errors.birthDate?.message}
          {...register("birthDate")}
        />

        <Input
          icon={<MapPin />}
          label="Address"
          placeholder="MalikAbad, Haripur, KPK, Pakistan"
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          icon={<Phone />}
          label="Personal Number"
          placeholder="0347-9107491"
          error={errors.phone1?.message}
          {...register("phone1")}
        />
        <Input
          icon={<Phone />}
          label="Family Number"
          placeholder="0347-9107491"
          error={errors.phone2?.message}
          {...register("phone2")}
        />

        <Select
          icon={<GraduationCap />}
          label="Education"
          placeholder="Select Education"
          options={educationOptions}
          error={errors.education?.message}
          {...register("education")}
        />

        {/* SECTOR */}
        <Select
          icon={<MapPin />}
          label="Sector"
          placeholder="Select Sector"
          options={sectorOptions}
          error={errors.sector?.message}
          {...register("sector")}
        />

        {/*  CURRENT LOCATION (FILTERED BY SECTOR) */}
        <Select
          icon={<MapPin />}
          label="Current Location"
          placeholder="Select Location"
          options={filteredLocations.map((loc) => ({
            label: loc.name,
            value: loc._id,
          }))}
          error={errors.currentLocation?.message}
          {...register("currentLocation")}
        />
        <Select
          icon={<Clock3 />}
          label="Default Shift"
          placeholder="Select Shift"
          options={shiftOptions}
          error={errors.defaultShift?.message}
          {...register("defaultShift")}
        />

        <Input
          type="date"
          icon={<CalendarDays />}
          label="Entry Date"
          error={errors.entryDate?.message}
          {...register("entryDate")}
        />

        <Input
          type="date"
          icon={<CalendarDays />}
          label="Exit Date"
          error={errors.exitDate?.message}
          {...register("exitDate")}
        />

        <Input
          icon={<User />}
          label="Reference"
          placeholder="Enter Reference Name"
          error={errors.reference?.message}
          {...register("reference")}
        />

        <Input
          icon={<Banknote />}
          type="number"
          label="Basic Salary"
          error={errors.basicSalary?.message}
          {...register("basicSalary", {
            valueAsNumber: true,
          })}
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
