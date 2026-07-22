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

  const {
    data: locations = [],
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useLocations({
    sector: selectedSector || undefined,
    isActive: true,
    enabled: Boolean(selectedSector),
  });

  const { handleCreateEmployee, loading } = useCreateEmployee({
    onSuccess: () => {
      toast.success("Employee created successfully.");
      router.push("/employees");
    },
    onError: (message) => {
      toast.error(message || "Failed to create employee.");
    },
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

  const locationOptions = useMemo(
    () =>
      locations.map((loc) => ({
        label: loc.name,
        value: loc._id,
      })),
    [locations],
  );

  const isLocationSelectDisabled =
    !selectedSector ||
    isLocationsLoading ||
    isLocationsError ||
    locationOptions.length === 0;

  const locationPlaceholder = !selectedSector
    ? "Select Sector First"
    : isLocationsLoading
      ? "Loading Locations..."
      : isLocationsError
        ? "Locations Unavailable"
        : locationOptions.length === 0
          ? "No Active Locations in This Sector"
          : "Select Location";

  const locationStatusMessage = !selectedSector
    ? "Select a sector to load available locations."
    : isLocationsLoading
      ? "Loading available locations..."
      : isLocationsError
        ? locationsError instanceof Error
          ? locationsError.message
          : "Unable to load locations right now."
        : locationOptions.length === 0
          ? "No active locations found for the selected sector."
          : "";

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

    return data;
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
          placeholder="Enter full name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          icon={<User />}
          label="Father Name"
          placeholder="Enter father's name"
          error={errors.fatherName?.message}
          {...register("fatherName")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          placeholder="Select designation"
          options={designationOptions}
          error={errors.designation?.message}
          {...register("designation")}
        />

        <Input
          icon={<CreditCard />}
          label="CNIC"
          placeholder="e.g. 13302-3475226-5"
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
          placeholder="Street 54, G10/3, Islamabad, Pakistan"
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          icon={<Phone />}
          label="Personal Number"
          placeholder="e.g. 0347-1234567"
          error={errors.phone1?.message}
          {...register("phone1")}
        />
        <Input
          icon={<Phone />}
          label="Family Number"
          placeholder="e.g. 0347-7654321"
          error={errors.phone2?.message}
          {...register("phone2")}
        />

        <Select
          icon={<GraduationCap />}
          label="Education"
          placeholder="Select education"
          options={educationOptions}
          error={errors.education?.message}
          {...register("education")}
        />

        {/* SECTOR */}
        <Select
          icon={<MapPin />}
          label="Sector"
          placeholder="Select sector"
          options={sectorOptions}
          error={errors.sector?.message}
          {...register("sector")}
        />

        {/*  CURRENT LOCATION (FILTERED BY SECTOR) */}
        <Select
          icon={<MapPin />}
          label="Current Location"
          placeholder={locationPlaceholder}
          options={locationOptions}
          disabled={isLocationSelectDisabled}
          aria-busy={isLocationsLoading}
          error={errors.currentLocation?.message}
          {...register("currentLocation")}
        />
        {locationStatusMessage && (
          <p className="mt-1 text-xs font-medium text-slate-500 md:col-span-2 lg:col-span-1">
            {locationStatusMessage}
          </p>
        )}
        <Select
          icon={<Clock3 />}
          label="Default Shift"
          placeholder="Select shift"
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
          placeholder="Enter reference name"
          error={errors.reference?.message}
          {...register("reference")}
        />

        <Input
          icon={<Banknote />}
          type="number"
          label="Basic Salary"
          placeholder="e.g. 35000"
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
