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
  MapPin,
  CreditCard,
  Save,
  BadgeCheck,
  Cake,
  Clock3,
  ImageUp,
  Plus,
  Trash2,
  UserPen,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

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
      setValue("exitDate", "", { shouldDirty: true });
    }
  }, [watchedStatus, clearErrors, setValue]);

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
    data.append(
      "exitDate",
      values.status === "inactive" ? values.exitDate : "",
    );

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
    <div className="space-y-6">
      <PageHeader
        title="Update Employee"
        description="Manage employee data easily and securely"
        icon={UserPen}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <TopStat label="Age" value={`${age} Years`} />
        <TopStat label="Created" value={formatDate(employee.createdAt)} />
        <TopStat
          label="Status"
          value={
            <Badge
              tone={employee.status === "active" ? "success" : "danger"}
              dot
              className="capitalize"
            >
              {employee.status}
            </Badge>
          }
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* PERSONAL INFORMATION */}
        <Card>
          <CardHeader
            icon={User}
            title="Personal Information"
            description="Profile picture and basic details"
          />

          <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
                <User className="size-7 text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <label
              className={buttonVariants({
                variant: "secondary",
                size: "sm",
                className: "cursor-pointer",
              })}
            >
              <ImageUp />
              Change Picture
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            <Button
              variant="danger-soft"
              size="sm"
              onClick={handleRemoveImage}
            >
              <Trash2 />
              Remove Picture
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <Input
          icon={<Cake />}
          type="date"
          label="Birth Date"
          {...register("birthDate")}
        />
        </div>
          </CardContent>
        </Card>

        {/* CONTACTS */}
        <Card>
          <CardHeader
            icon={Phone}
            title="Contacts"
            description="Emergency contacts and references"
          />

          <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Emergency Contacts</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                appendEmergencyContact({
                  name: "",
                  relation: "",
                  contact: "",
                  address: "",
                  isPrimary: false,
                })
              }
            >
              <Plus /> Add contact
            </Button>
          </div>
          {emergencyContactFields.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500">No emergency contacts added.</p>
          )}
          {emergencyContactFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-2 lg:grid-cols-5"
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
              <div className="flex items-end justify-between gap-3 sm:items-center lg:items-end lg:pb-1">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded accent-blue-600"
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove emergency contact"
                  title="Remove emergency contact"
                  onClick={() => removeEmergencyContact(index)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {errors.emergencyContacts?.message && (
            <p className="text-sm font-medium text-red-600">
              {errors.emergencyContacts.message}
            </p>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">References</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                appendReference({ name: "", relation: "", contact: "", address: "" })
              }
            >
              <Plus /> Add reference
            </Button>
          </div>
          {referenceFields.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-sm text-slate-500">No references added.</p>
          )}
          {referenceFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-2 lg:grid-cols-5"
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
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Remove reference"
                title="Remove reference"
                onClick={() => removeReference(index)}
                className="self-end justify-self-end text-red-600 hover:bg-red-50 hover:text-red-700 lg:mb-1"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
          </CardContent>
        </Card>

        {/* JOB DETAILS */}
        <Card>
          <CardHeader
            icon={BadgeCheck}
            title="Job Details"
            description="Designation, location, shift and employment status"
          />

          <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        {watchedStatus === "inactive" && (
          <Input
            icon={<Clock3 />}
            type="date"
            label="Exit Date"
            error={errors.exitDate?.message}
            {...register("exitDate")}
          />
        )}

        <Select
          icon={<BadgeCheck />}
          label="Status"
          placeholder="Select Status"
          options={["active", "inactive"]}
          {...register("status")}
        />
        </div>

        {locationStatusMessage && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
            {locationStatusMessage}
          </div>
        )}
          </CardContent>
        </Card>

        {/* CNIC DOCUMENTS */}
        <Card>
          <CardHeader
            icon={ImageUp}
            title="CNIC Documents"
            description="Update front and back CNIC images"
          />

          <CardContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    CNIC Front
                  </span>
                  <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
                </div>

                <div className="relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-white">
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

              <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    CNIC Back
                  </span>
                  <span className="text-xs text-slate-500">PNG, JPG, WEBP</span>
                </div>

                <div className="relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-white">
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
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full sm:w-auto sm:min-w-45"
          >
            {!loading && <Save />}
            {loading ? "Updating..." : "Update Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function TopStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-card">
      <p className="truncate text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
