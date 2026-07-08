"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { educationOptions, designationOptions } from "@/constants/employee";
import { sectorOptions } from "@/constants/location";
import { useLocations } from "@/hooks/location/useLocation";

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
  Banknote,
  BriefcaseBusiness,
  Cake,
  Clock3,
} from "lucide-react";

import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";
import Input from "@/components/Input";
import Select from "@/components/Select";

import { Employee } from "@/types/employee";
import { calculateAge, formatDate } from "@/utils/employeeFormat";
import { shiftOptions } from "@/constants/shiftOptions";
import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeShift,
  SectorOptions,
} from "@/types/employee";

type FormValues = {
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
  currentLocation: string;

  defaultShift?: EmployeeShift | "";

  reference: string;
  status: "active" | "inactive";

  entryDate: string;
  exitDate: string;

  basicSalary: number;
};

type Props = {
  employee: Employee;
};

const normalizeSector = (sector?: string | null): SectorOptions | "" => {
  if (!sector) return "";

  const normalized = sector
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");

  return sectorOptions.some((option) => option.value === normalized)
    ? (normalized as SectorOptions)
    : "";
};

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();
  const { data: locationsData } = useLocations();

  const { handleUpdateEmployee, loading } = useUpdateEmployee();

  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      name: employee.name || "",
      fatherName: employee.fatherName || "",
      birthDate: employee.birthDate?.split("T")[0] || "",
      cnic: employee.cnic || "",
      address: employee.address || "",
      phone1: employee.phone1 || "",
      phone2: employee.phone2 || "",
      education: employee.education ?? undefined,
      designation: employee.designation,
      defaultShift: employee.defaultShift ?? undefined,

      sector: normalizeSector(employee.sector),

      currentLocation:
        typeof employee.currentLocation === "string"
          ? employee.currentLocation
          : employee.currentLocation?._id || "",

      reference: employee.reference || "",
      status: employee.status || "active",
      entryDate: employee.entryDate?.split("T")[0] || "",
      exitDate: employee.exitDate?.split("T")[0] || "",
      basicSalary: employee.basicSalary || 0,
    },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    employee.profileImage || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  const watchedBirthDate = useWatch({
    control,
    name: "birthDate",
  });

  const watchedEntryDate = useWatch({
    control,
    name: "entryDate",
  });

  const watchedSector = useWatch({
    control,
    name: "sector",
  });

  const locationOptions = useMemo(() => {
    return (
      locationsData
        ?.filter(
          (location) =>
            location.isActive &&
            normalizeSector(location.sector) === normalizeSector(watchedSector),
        )
        .map((location) => ({
          label: location.name,
          value: location._id,
        })) || []
    );
  }, [locationsData, watchedSector]);
  const age = watchedBirthDate ? calculateAge(watchedBirthDate) : 0;

  useEffect(() => {
    if (!employee) return;

    reset({
      name: employee.name || "",
      fatherName: employee.fatherName || "",
      birthDate: employee.birthDate?.split("T")[0] || "",
      cnic: employee.cnic || "",
      address: employee.address || "",
      phone1: employee.phone1 || "",
      phone2: employee.phone2 || "",
      education: employee.education ?? undefined,
      designation: employee.designation,
      defaultShift: employee.defaultShift ?? undefined,

      sector: normalizeSector(employee.sector),

      currentLocation:
        typeof employee.currentLocation === "string"
          ? employee.currentLocation
          : employee.currentLocation?._id || "",

      reference: employee.reference || "",
      status: employee.status || "active",
      entryDate: employee.entryDate?.split("T")[0] || "",
      exitDate: employee.exitDate?.split("T")[0] || "",
      basicSalary: employee.basicSalary || 0,
    });
  }, [employee, reset]);

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

  const onSubmit = async (values: FormValues) => {
    const data = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value == null ? "" : String(value));
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
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-xl">
      {/* HEADER */}
      <div className="bg-linear-to-r from-orange-500 to-amber-500 px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
              <ShieldCheck className="h-4 w-4" />
              Employee Management
            </div>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Update Employee
            </h2>

            <p className="text-sm text-orange-100">
              Manage employee data easily and securely
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <TopStat label="Age" value={`${age} Years`} />
            <TopStat label="Created" value={formatDate(employee.createdAt)} />
            <TopStat label="Entry" value={formatDate(watchedEntryDate)} />
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 px-4 py-6 sm:px-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* IMAGE */}
        <div className="md:col-span-2 lg:col-span-3 flex items-center gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border bg-gray-100">
            {preview ? (
              <Image
                src={preview}
                alt="profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              Change Picture
              <input type="file" hidden onChange={handleImageChange} />
            </label>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Remove Picture
            </button>
          </div>
        </div>

        {/* FIELDS */}
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
          placeholder="Select Education"
          options={educationOptions}
          {...register("education")}
        />

        <Select
          icon={<ShieldCheck />}
          label="Designation"
          placeholder="Select Designation"
          options={designationOptions}
          {...register("designation")}
        />
        <Select
          icon={<MapPin />}
          label="Sector"
          placeholder="Select Sector"
          options={sectorOptions}
          {...register("sector")}
        />
        <Select
          icon={<MapPin />}
          label="Current Location"
          placeholder="Select Location"
          options={locationOptions}
          {...register("currentLocation")}
        />
        <Select
          icon={<Clock3 />}
          label="Default Shift"
          placeholder="Select Shift"
          options={shiftOptions}
          {...register("defaultShift")}
        />

        <Input
          icon={<Banknote />}
          type="number"
          label="Basic Salary"
          {...register("basicSalary", { valueAsNumber: true })}
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
            className="w-full rounded-xl bg-orange-600 py-4 font-bold text-white"
          >
            <Save className="inline-block h-5 w-5 mr-2" />
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TopStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/20 p-2 text-white">
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
