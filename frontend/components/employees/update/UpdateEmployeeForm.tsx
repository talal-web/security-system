"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";

import {
  educationOptions,
  designationOptions,
} from "@/constants/employee/employeeOptions";
import { shiftOptions } from "@/constants/shiftOptions";

import { useEmployeeLocations } from "@/hooks/employee/create/useEmployeeLocations";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";

import SectorSelect from "@/components/sectors/SectorSelect";
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
  BriefcaseBusiness,
  Cake,
  Clock3,
  ImageUp,
} from "lucide-react";

import { Employee } from "@/types/employee";
import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeShift,
  SectorOptions,
} from "@/types/employee";

import { calculateAge, formatDate } from "@/utils/employee/employeeFormat";

type FormValues = {
  name: string;
  fatherName: string;
  birthDate: string;
  cnic: string;
  address: string;
  phone1: string;
  phone2: string;

  education: EducationLevel | "";
  designation: EmployeeDesignation;

  sector: string;
  currentLocation: string;

  defaultShift: EmployeeShift | "";

  reference: string;
  status: "active" | "inactive";

  entryDate: string;
  exitDate: string;
};

type Props = {
  employee: Employee;
};

const getSectorId = (sector?: SectorOptions | string | null): string => {
  if (!sector) return "";

  if (typeof sector === "object") {
    return sector._id || "";
  }

  return sector;
};

const normalizeDate = (date?: string | Date | null): string => {
  if (!date) return "";

  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  return date.split("T")[0];
};

const getCurrentLocationId = (
  currentLocation: Employee["currentLocation"],
): string => {
  if (!currentLocation) return "";

  if (typeof currentLocation === "string") {
    return currentLocation;
  }

  return currentLocation._id || "";
};

const getEmployeeFormValues = (employee: Employee): FormValues => ({
  name: employee.name || "",
  fatherName: employee.fatherName || "",
  birthDate: normalizeDate(employee.birthDate),
  cnic: employee.cnic || "",
  address: employee.address || "",
  phone1: employee.phone1 || "",
  phone2: employee.phone2 || "",
  education: employee.education ?? "",
  designation: employee.designation,
  sector: getSectorId(employee.sector),
  currentLocation: getCurrentLocationId(employee.currentLocation),
  defaultShift: employee.defaultShift ?? "",
  reference: employee.reference || "",
  status: employee.status || "active",
  entryDate: normalizeDate(employee.entryDate),
  exitDate: normalizeDate(employee.exitDate),
});

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();
  const { handleUpdateEmployee, loading } = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: getEmployeeFormValues(employee),
    mode: "onChange",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    employee.profileImage || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  const [cnicFrontImage, setCnicFrontImage] = useState<File | null>(null);
  const [cnicFrontPreview, setCnicFrontPreview] = useState<string | null>(
    employee.cnicFrontImage || null,
  );

  const [cnicBackImage, setCnicBackImage] = useState<File | null>(null);
  const [cnicBackPreview, setCnicBackPreview] = useState<string | null>(
    employee.cnicBackImage || null,
  );

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

  const watchedStatus = useWatch({
    control,
    name: "status",
  });

  const previousSectorRef = useRef<string>(getSectorId(employee.sector));

  const {
    options: locationOptions,
    disabled: isLocationSelectDisabled,
    placeholder: locationPlaceholder,
    statusMessage: locationStatusMessage,
    isLoading: isLocationsLoading,
  } = useEmployeeLocations(watchedSector || undefined);

  const age = watchedBirthDate ? calculateAge(watchedBirthDate) : 0;

  useEffect(() => {
    if (watchedStatus === "active") {
      clearErrors("exitDate");
    }
  }, [watchedStatus, clearErrors]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      if (cnicFrontPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(cnicFrontPreview);
      }

      if (cnicBackPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(cnicBackPreview);
      }
    };
  }, [preview, cnicFrontPreview, cnicBackPreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);

    setProfileImage(file);
    setPreview(objectUrl);
    setRemoveImage(false);

    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setProfileImage(null);
    setPreview(null);
    setRemoveImage(true);
  };

  const handleCnicFrontImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cnicFrontPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(cnicFrontPreview);
    }

    const objectUrl = URL.createObjectURL(file);

    setCnicFrontImage(file);
    setCnicFrontPreview(objectUrl);

    e.target.value = "";
  };

  const handleCnicBackImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cnicBackPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(cnicBackPreview);
    }

    const objectUrl = URL.createObjectURL(file);

    setCnicBackImage(file);
    setCnicBackPreview(objectUrl);

    e.target.value = "";
  };

  const onSubmit = async (values: FormValues) => {
    clearErrors();

    if (values.status === "inactive" && !values.exitDate) {
      setError("exitDate", {
        type: "manual",
        message: "Exit date is required for an inactive employee.",
      });
      return;
    }

    const exitDate = values.status === "active" ? "" : values.exitDate;

    const data = new FormData();

    data.append("name", values.name.trim());
    data.append("fatherName", values.fatherName.trim());
    data.append("birthDate", values.birthDate);
    data.append("cnic", values.cnic.trim());
    data.append("address", values.address.trim());
    data.append("phone1", values.phone1.trim());
    data.append("phone2", values.phone2.trim());
    data.append("education", values.education || "");
    data.append("designation", values.designation);
    data.append("sector", values.sector || "");
    data.append("currentLocation", values.currentLocation || "");
    data.append("defaultShift", values.defaultShift || "");
    data.append("reference", values.reference.trim());
    data.append("status", values.status);
    data.append("entryDate", values.entryDate);
    data.append("exitDate", exitDate);

    if (profileImage) {
      data.append("profileImage", profileImage);
    }

    if (cnicFrontImage) {
      data.append("cnicFrontImage", cnicFrontImage);
    }

    if (cnicBackImage) {
      data.append("cnicBackImage", cnicBackImage);
    }

    if (removeImage) {
      data.append("removeProfileImage", "true");
    }

    try {
      await handleUpdateEmployee({
        id: employee._id,
        employeeData: data,
      });

      router.push("/employees");
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-xl">
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 px-4 py-6 sm:px-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="flex items-center gap-5 md:col-span-2 lg:col-span-3">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border bg-gray-100">
            {preview ? (
              <Image
                src={preview}
                alt="Employee profile"
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
            <label className="cursor-pointer rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-200">
              Change Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
            >
              Remove Picture
            </button>
          </div>
        </div>

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

        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <SectorSelect
              {...field}
              value={field.value ?? ""}
              onChange={(event) => {
                const nextSector = event.target.value;
                const prevSector = previousSectorRef.current;

                field.onChange(nextSector);

                if (prevSector && prevSector !== nextSector) {
                  setValue("currentLocation", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }

                previousSectorRef.current = nextSector;
              }}
            />
          )}
        />

        <Controller
          name="currentLocation"
          control={control}
          render={({ field }) => (
            <Select
              icon={<MapPin />}
              label="Current Location"
              placeholder={locationPlaceholder}
              options={locationOptions}
              disabled={isLocationSelectDisabled}
              aria-busy={isLocationsLoading}
              value={field.value ?? ""}
              onChange={(event) => field.onChange(event.target.value)}
            />
          )}
        />

        <Select
          icon={<Clock3 />}
          label="Default Shift"
          placeholder="Select Shift"
          options={shiftOptions}
          {...register("defaultShift")}
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
          disabled={watchedStatus === "active"}
          {...register("exitDate")}
        />

        {errors.exitDate && (
          <p className="text-sm text-red-600">{errors.exitDate.message}</p>
        )}

        <Input
          icon={<Cake />}
          type="date"
          label="Birth Date"
          {...register("birthDate")}
        />

        <Select
          icon={<BadgeCheck />}
          label="Status"
          placeholder="Select Status"
          options={["active", "inactive"]}
          {...register("status")}
        />

        {locationStatusMessage && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:col-span-2 lg:col-span-3">
            {locationStatusMessage}
          </div>
        )}

        <div className="md:col-span-2 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                <ImageUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  CNIC Documents
                </h3>
                <p className="text-sm text-slate-500">
                  Update front and back CNIC images
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition hover:border-orange-300 hover:bg-orange-50">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    CNIC Front
                  </span>
                  <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
                </div>

                <div className="relative h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {cnicFrontPreview ? (
                    <Image
                      src={cnicFrontPreview}
                      alt="CNIC front preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageUp className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  hidden
                  onChange={handleCnicFrontImageChange}
                />
              </label>

              <label className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition hover:border-orange-300 hover:bg-orange-50">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    CNIC Back
                  </span>
                  <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
                </div>

                <div className="relative h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {cnicBackPreview ? (
                    <Image
                      src={cnicBackPreview}
                      alt="CNIC back preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageUp className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  hidden
                  onChange={handleCnicBackImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-orange-600 py-4 font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="mr-2 h-5 w-5" />
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
