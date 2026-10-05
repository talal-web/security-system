"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
  Controller,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  educationOptions,
  designationOptions,
} from "@/constants/employee/employeeOptions";
import { shiftOptions } from "@/constants/shiftOptions";

import { useEmployeeLocations } from "@/hooks/employee/create/useEmployeeLocations";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";
import { useSelectedArea } from "@/components/area/AreaContext";

import AreaSelect from "@/components/area/AreaSelect";
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
  Cake,
  Clock3,
  ImageUp,
  Plus,
  Trash2,
} from "lucide-react";

import { Employee } from "@/types/employee";
import {
  EducationLevel,
  EmployeeDesignation,
  EmployeeEmergencyContact,
  EmployeeReference,
  EmployeeShift,
  SectorOptions,
} from "@/types/employee";

import { calculateAge, formatDate } from "@/utils/employee/employeeFormat";
import { employeeContactFieldsSchema } from "@/utils/employee/employeeSchema";

type FormValues = {
  name: string;
  fatherName: string;
  birthDate: string;
  cnic: string;
  address: string;
  phone1: string;
  emergencyContacts: EmployeeEmergencyContact[];
  references: EmployeeReference[];

  education: EducationLevel | "";
  designation: EmployeeDesignation;

  area: string;
  sector: string;
  currentLocation: string;

  defaultShift: EmployeeShift | "";

  status: "active" | "inactive";

  entryDate: string;
  exitDate: string;
};

type Props = {
  employee: Employee;
};

const getAreaId = (area?: { _id?: string } | string | null): string => {
  if (!area) return "";

  if (typeof area === "object") {
    return area._id || "";
  }

  return area;
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
  emergencyContacts: employee.emergencyContacts || [],
  references: employee.references || [],
  education: employee.education ?? "",
  designation: employee.designation,
  area: getAreaId(employee.area),
  sector: getSectorId(employee.sector),
  currentLocation: getCurrentLocationId(employee.currentLocation),
  defaultShift: employee.defaultShift ?? "",
  status: employee.status || "active",
  entryDate: normalizeDate(employee.entryDate),
  exitDate: normalizeDate(employee.exitDate),
});

export default function UpdateEmployeeForm({ employee }: Props) {
  const router = useRouter();
  const { getAreaAwareHref } = useSelectedArea();
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
    resolver: zodResolver(employeeContactFieldsSchema) as unknown as Resolver<FormValues>,
    defaultValues: getEmployeeFormValues(employee),
    mode: "onChange",
  });

  const {
    fields: emergencyContactFields,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({ control, name: "emergencyContacts" });

  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({ control, name: "references" });

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

  const watchedArea = useWatch({
    control,
    name: "area",
  });

  const watchedSector = useWatch({
    control,
    name: "sector",
  });

  const watchedStatus = useWatch({
    control,
    name: "status",
  });

  const previousAreaRef = useRef<string>(getAreaId(employee.area));
  const previousSectorRef = useRef<string>(getSectorId(employee.sector));

  const {
    options: locationOptions,
    disabled: isLocationSelectDisabled,
    placeholder: locationPlaceholder,
    statusMessage: locationStatusMessage,
    isLoading: isLocationsLoading,
  } = useEmployeeLocations(watchedSector || undefined);

  useEffect(() => {
    if (!watchedArea && !watchedSector) return;

    if (watchedArea && watchedSector) {
      return;
    }

    setValue("currentLocation", "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [watchedArea, watchedSector, setValue]);

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
    data.append("emergencyContacts", JSON.stringify(values.emergencyContacts));
    data.append("references", JSON.stringify(values.references));
    data.append("education", values.education || "");
    data.append("designation", values.designation);
    data.append("area", values.area || "");
    data.append("sector", values.sector || "");
    data.append("currentLocation", values.currentLocation || "");
    data.append("defaultShift", values.defaultShift || "");
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

      router.push(getAreaAwareHref("/employees"));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update employee. Please try again.",
      );
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

        <Input
          icon={<Phone />}
          label="Phone 1"
          error={errors.phone1?.message}
          {...register("phone1")}
        />

        <Input icon={<MapPin />} label="Address" {...register("address")} />

        <div className="space-y-3 md:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Emergency Contacts</h3>
            <button
              type="button"
              onClick={() =>
                appendEmergencyContact({
                  name: "",
                  relation: "",
                  contact: "",
                  address: "",
                  isPrimary: false,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> Add contact
            </button>
          </div>
          {emergencyContactFields.length === 0 && (
            <p className="text-sm text-slate-500">No emergency contacts added.</p>
          )}
          {emergencyContactFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <Input
                label="Name"
                maxLength={100}
                error={errors.emergencyContacts?.[index]?.name?.message}
                {...register(`emergencyContacts.${index}.name`)}
              />
              <Input
                label="Relation"
                maxLength={50}
                error={errors.emergencyContacts?.[index]?.relation?.message}
                {...register(`emergencyContacts.${index}.relation`)}
              />
              <Input
                type="tel"
                label="Contact"
                maxLength={20}
                error={errors.emergencyContacts?.[index]?.contact?.message}
                {...register(`emergencyContacts.${index}.contact`)}
              />
              <Input
                label="Address"
                maxLength={300}
                error={errors.emergencyContacts?.[index]?.address?.message}
                {...register(`emergencyContacts.${index}.address`)}
              />
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-orange-600"
                    {...(() => {
                      const field = register(
                        `emergencyContacts.${index}.isPrimary`,
                      );
                      return {
                        ...field,
                        onChange: (event) => {
                          field.onChange(event);
                          if (event.target.checked) {
                            emergencyContactFields.forEach((_, otherIndex) => {
                              if (otherIndex !== index) {
                                setValue(
                                  `emergencyContacts.${otherIndex}.isPrimary`,
                                  false,
                                  { shouldDirty: true, shouldValidate: true },
                                );
                              }
                            });
                          }
                        },
                      };
                    })()}
                  />
                  Primary
                </label>
                <button
                  type="button"
                  aria-label="Remove emergency contact"
                  title="Remove emergency contact"
                  onClick={() => removeEmergencyContact(index)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {errors.emergencyContacts?.message && (
            <p className="text-sm text-red-600">
              {errors.emergencyContacts.message}
            </p>
          )}
        </div>

        <div className="space-y-3 md:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">References</h3>
            <button
              type="button"
              onClick={() =>
                appendReference({ name: "", relation: "", contact: "", address: "" })
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> Add reference
            </button>
          </div>
          {referenceFields.length === 0 && (
            <p className="text-sm text-slate-500">No references added.</p>
          )}
          {referenceFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <Input
                label="Name"
                maxLength={100}
                error={errors.references?.[index]?.name?.message}
                {...register(`references.${index}.name`)}
              />
              <Input
                label="Relation"
                maxLength={50}
                error={errors.references?.[index]?.relation?.message}
                {...register(`references.${index}.relation`)}
              />
              <Input
                type="tel"
                label="Contact"
                maxLength={20}
                error={errors.references?.[index]?.contact?.message}
                {...register(`references.${index}.contact`)}
              />
              <Input
                label="Address"
                maxLength={300}
                error={errors.references?.[index]?.address?.message}
                {...register(`references.${index}.address`)}
              />
              <button
                type="button"
                aria-label="Remove reference"
                title="Remove reference"
                onClick={() => removeReference(index)}
                className="justify-self-end rounded-md p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

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
          name="area"
          control={control}
          render={({ field }) => (
            <AreaSelect
              {...field}
              value={field.value ?? ""}
              onChange={(event) => {
                const nextArea = event.target.value;
                const prevArea = previousAreaRef.current;

                field.onChange(nextArea);

                if (prevArea && prevArea !== nextArea) {
                  setValue("sector", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setValue("currentLocation", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }

                previousAreaRef.current = nextArea;
              }}
            />
          )}
        />

        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <SectorSelect
              areaId={watchedArea || undefined}
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
