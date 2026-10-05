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
  CalendarDays,
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
} from "lucide-react";

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

    const form = buildEmployeeFormData(values, {
      profileImage,
      cnicFrontImage,
      cnicBackImage,
    });
    return await handleCreateEmployee(form);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER */}
          <div className="relative overflow-hidden bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  Employee Management
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    Create Employee
                  </h1>
                  <p className="max-w-2xl text-sm text-orange-50 sm:text-base">
                    Add a new employee and securely manage their information.
                  </p>
                </div>
              </div>

              {/* PROFILE IMAGE */}
              <label className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur sm:self-auto">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/30 bg-white/10 sm:h-24 sm:w-24">
                  {profilePreviewUrl ? (
                    <Image
                      src={profilePreviewUrl}
                      alt="Selected employee profile preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-white">
                      <User className="h-8 w-8" />
                      <span className="mt-1 text-[10px]">Upload</span>
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

                <div className="text-white">
                  <p className="text-sm font-semibold">Profile Image (Required)</p>
                  <p className="text-xs text-white/80">PNG, JPG or WEBP</p>
                  {imageErrors.profileImage && (
                    <p className="text-xs text-red-100">{imageErrors.profileImage}</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              {/* PERSONAL INFORMATION */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic employee details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    placeholder="House No. 12, Street 54, G-10/3, Islamabad, Pakistan"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    {...register("address")}
                  />
                  {errors.address?.message && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </section>

              <div className="border-t border-slate-200" />

              {/* CONTACT INFORMATION */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Contact Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Phone numbers and emergency contact
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Input
                    icon={<Phone />}
                    label="Personal Number"
                    placeholder="0347-1234567"
                    error={errors.phone1?.message}
                    {...register("phone1")}
                  />
                </div>
                {errors.emergencyContacts?.message && (
                  <p className="text-sm text-red-600">
                    {errors.emergencyContacts.message}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Emergency Contacts
                    </h3>
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
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      References
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        appendReference({
                          name: "",
                          relation: "",
                          contact: "",
                          address: "",
                        })
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
              </section>

              <div className="border-t border-slate-200" />

              {/* JOB DETAILS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Job Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Location, shift, salary, and employment status
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

                  <Select
                    icon={<BadgeCheck />}
                    label="Status"
                    options={["active", "inactive"]}
                    error={errors.status?.message}
                    {...register("status")}
                  />
                </div>

                {locationStatusMessage && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {locationStatusMessage}
                  </div>
                )}
              </section>

              <div className="border-t border-slate-200" />

              {/* DOCUMENTS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <ImageUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Documents
                    </h2>
                    <p className="text-sm text-slate-500">
                      Upload CNIC front and back images
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      CNIC Front Picture (Required)
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-300 hover:bg-orange-50">
                      <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white">
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
                      <p className="text-sm text-red-600">{imageErrors.cnicFrontImage}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      CNIC Back Picture (Required)
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-300 hover:bg-orange-50">
                      <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white">
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
                      <p className="text-sm text-red-600">{imageErrors.cnicBackImage}</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* ACTION BAR */}
            <div className="sticky bottom-0 mt-8 border-t border-slate-200 bg-white/95 pt-4 backdrop-blur sm:flex sm:items-center sm:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-45"
              >
                <Save className="h-4 w-4" />
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
