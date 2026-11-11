"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";

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
  ImageUp,
  BadgeCheck,
  Cake,
  Banknote,
  Clock3,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

import { useCreateEmployee } from "@/hooks/employee/create/useCreateEmployee";
import { useEmployeeLocations } from "@/hooks/employee/create/useEmployeeLocations";
import { useImagePreview } from "@/hooks/employee/create/useImagePreview";
import { useSelectedArea } from "@/components/area/AreaContext";
import AreaSelect from "@/components/area/AreaSelect";
import SectorSelect from "@/components/sectors/SectorSelect";

import { employeeSchema } from "@/utils/employee/employeeSchema";

import {
  educationOptions,
  designationOptions,
} from "@/constants/employee/employeeOptions";
import { shiftOptions } from "@/constants/shiftOptions";
import {
  defaultEmployeeValues,
  EmployeeFormValues,
} from "@/constants/employee/defaultValues";
import { buildEmployeeFormData } from "@/utils/employee/buildEmployeeFormData";

export default function CreateEmployeeForm() {
  const router = useRouter();
  const { selectedAreaId, getAreaAwareHref } = useSelectedArea();
  const [imageErrors, setImageErrors] = useState<{
    profileImage?: string;
    cnicFrontImage?: string;
    cnicBackImage?: string;
  }>({});

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeFormValues>,
    defaultValues: defaultEmployeeValues,
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

  const selectedArea = useWatch({
    control,
    name: "area",
  });

  const selectedSector = useWatch({
    control,
    name: "sector",
  });
  useEffect(() => {
    if (!selectedAreaId || selectedArea === selectedAreaId) return;

    setValue("area", selectedAreaId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("sector", "", {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("currentLocation", "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [selectedAreaId, selectedArea, setValue]);

  const { handleCreateEmployee, loading } = useCreateEmployee({
    onSuccess: () => {
      toast.success("Employee created successfully.");
      router.push(getAreaAwareHref("/employees"));
    },
    onError: (message) => {
      toast.error(message || "Failed to create employee.");
    },
  });

  const {
    image: profileImage,
    setImage: setProfileImage,
    previewUrl: profilePreviewUrl,
  } = useImagePreview();

  const {
    image: cnicFrontImage,
    setImage: setCnicFrontImage,
    previewUrl: cnicFrontPreviewUrl,
  } = useImagePreview();

  const {
    image: cnicBackImage,
    setImage: setCnicBackImage,
    previewUrl: cnicBackPreviewUrl,
  } = useImagePreview();

  const {
    options: locationOptions,
    disabled: isLocationSelectDisabled,
    placeholder: locationPlaceholder,
    statusMessage: locationStatusMessage,
    isLoading: isLocationsLoading,
  } = useEmployeeLocations(selectedSector);

  const onSubmit = async (values: EmployeeFormValues) => {
    const missingImages = {
      profileImage: !profileImage,
      cnicFrontImage: !cnicFrontImage,
      cnicBackImage: !cnicBackImage,
    };

    setImageErrors({
      profileImage: missingImages.profileImage ? "Profile image is required" : undefined,
      cnicFrontImage: missingImages.cnicFrontImage ? "CNIC front image is required" : undefined,
      cnicBackImage: missingImages.cnicBackImage ? "CNIC back image is required" : undefined,
    });

    if (Object.values(missingImages).some(Boolean)) {
      toast.error("Upload the profile image and both CNIC images to continue.");
      return;
    }

    const form = buildEmployeeFormData(
      {
        ...values,
        status: "active",
        exitDate: "",
      },
      {
        profileImage,
        cnicFrontImage,
        cnicBackImage,
      },
    );
    return await handleCreateEmployee(form);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Create Employee"
        description="Add a new employee and securely manage their information."
        icon={UserPlus}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* PERSONAL INFORMATION */}
              <Card>
                <CardHeader
                  icon={User}
                  title="Personal Information"
                  description="Basic employee details"
                />

                <CardContent className="space-y-5">
                {/* PROFILE IMAGE */}
                <div>
                  <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40 sm:max-w-md">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white sm:size-20">
                      {profilePreviewUrl ? (
                        <Image
                          src={profilePreviewUrl}
                          alt="Selected employee profile preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                          <User className="size-6" />
                          <span className="mt-1 text-[10px] font-medium">Upload</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          setProfileImage(e.target.files?.[0] || null);
                          setImageErrors((current) => ({ ...current, profileImage: undefined }));
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">Profile Image (Required)</p>
                      <p className="text-xs text-slate-500">PNG, JPG or WEBP</p>
                    </div>
                  </label>
                  {imageErrors.profileImage && (
                    <p className="mt-1 text-xs font-medium text-red-500">{imageErrors.profileImage}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                  <Select
                    icon={<GraduationCap />}
                    label="Education"
                    placeholder="Select education"
                    options={educationOptions}
                    error={errors.education?.message}
                    {...register("education")}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    placeholder="House No. 12, Street 54, G-10/3, Islamabad, Pakistan"
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 ${
                      errors.address?.message ? "border-red-400" : "border-slate-200 hover:border-slate-300"
                    }`}
                    {...register("address")}
                  />
                  {errors.address?.message && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                </CardContent>
              </Card>

              {/* CONTACT INFORMATION */}
              <Card>
                <CardHeader
                  icon={Phone}
                  title="Contact Information"
                  description="Phone numbers and emergency contact"
                />

                <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    icon={<Phone />}
                    label="Personal Number"
                    placeholder="0347-1234567"
                    error={errors.phone1?.message}
                    {...register("phone1")}
                  />
                </div>
                {errors.emergencyContacts?.message && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.emergencyContacts.message}
                  </p>
                )}

                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Emergency Contacts
                    </h3>
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
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      References
                    </h3>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        appendReference({
                          name: "",
                          relation: "",
                          contact: "",
                          address: "",
                        })
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
                  description="Location, shift, salary, and employment status"
                />

                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AreaSelect
                    label="Area"
                    placeholder="Select Area"
                    useGlobalSelection
                    value={selectedArea ?? ""}
                    onChange={(event) => {
                      const nextArea = event.target.value;
                      setValue("area", nextArea, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setValue("sector", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setValue("currentLocation", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    className="w-full rounded-lg px-3 py-2"
                  />

                  <SectorSelect
                    areaId={selectedArea || undefined}
                    {...register("sector")}
                    onChange={(event) => {
                      const nextSector = event.target.value;
                      setValue("sector", nextSector, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setValue("currentLocation", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    className="w-full rounded-lg px-3 py-2"
                  />

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

                  <Select
                    icon={<Clock3 />}
                    label="Default Shift"
                    placeholder="Select shift"
                    options={shiftOptions}
                    error={errors.defaultShift?.message}
                    {...register("defaultShift")}
                  />

                  <Input
                    icon={<Banknote />}
                    type="number"
                    label="Monthly Salary"
                    placeholder="40000"
                    min={0}
                    error={errors.monthlySalary?.message}
                    {...register("monthlySalary", {
                      valueAsNumber: true,
                    })}
                  />

                </div>

                {locationStatusMessage && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                    {locationStatusMessage}
                  </div>
                )}
                </CardContent>
              </Card>

              {/* DOCUMENTS */}
              <Card>
                <CardHeader
                  icon={ImageUp}
                  title="Documents"
                  description="Upload CNIC front and back images"
                />

                <CardContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      CNIC Front Picture (Required)
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-24 sm:w-32">
                        {cnicFrontPreviewUrl ? (
                          <Image
                            src={cnicFrontPreviewUrl}
                            alt="Selected CNIC front preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <ImageUp className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {cnicFrontImage
                            ? cnicFrontImage.name
                            : "Upload front side"}
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, or WEBP
                        </p>
                      </div>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          setCnicFrontImage(e.target.files?.[0] || null);
                          setImageErrors((current) => ({ ...current, cnicFrontImage: undefined }));
                        }}
                      />
                    </label>
                    {imageErrors.cnicFrontImage && (
                      <p className="text-xs font-medium text-red-500">{imageErrors.cnicFrontImage}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      CNIC Back Picture (Required)
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-24 sm:w-32">
                        {cnicBackPreviewUrl ? (
                          <Image
                            src={cnicBackPreviewUrl}
                            alt="Selected CNIC back preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <ImageUp className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {cnicBackImage
                            ? cnicBackImage.name
                            : "Upload back side"}
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG, or WEBP
                        </p>
                      </div>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          setCnicBackImage(e.target.files?.[0] || null);
                          setImageErrors((current) => ({ ...current, cnicBackImage: undefined }));
                        }}
                      />
                    </label>
                    {imageErrors.cnicBackImage && (
                      <p className="text-xs font-medium text-red-500">{imageErrors.cnicBackImage}</p>
                    )}
                  </div>
                </div>
                </CardContent>
              </Card>

        {/* ACTION BAR */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full sm:w-auto sm:min-w-45"
          >
            {!loading && <Save />}
            {loading ? "Creating..." : "Create Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
