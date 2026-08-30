"use client";

import Image from "next/image";
import { toast } from "sonner";
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
  ImageUp,
  BadgeCheck,
  Cake,
  Banknote,
  Clock3,
} from "lucide-react";

import { useCreateEmployee } from "@/hooks/employee/create/useCreateEmployee";
import { useEmployeeLocations } from "@/hooks/employee/create/useEmployeeLocations";
import { useImagePreview } from "@/hooks/employee/create/useImagePreview";
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeFormValues>,
    defaultValues: defaultEmployeeValues,
  });

  const selectedSector = useWatch({
    control,
    name: "sector",
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
                    onChange={(e) =>
                      setProfileImage(e.target.files?.[0] || null)
                    }
                  />
                </div>

                <div className="text-white">
                  <p className="text-sm font-semibold">Profile Image</p>
                  <p className="text-xs text-white/80">PNG, JPG or WEBP</p>
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

                  <Input
                    icon={<Phone />}
                    label="Family Number"
                    placeholder="0347-7654321"
                    error={errors.phone2?.message}
                    {...register("phone2")}
                  />

                  <Input
                    icon={<User />}
                    label="Reference"
                    placeholder="Enter reference name"
                    error={errors.reference?.message}
                    {...register("reference")}
                  />
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
                  <SectorSelect
                    {...register("sector")}
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
                      CNIC Front Picture
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
                        onChange={(e) =>
                          setCnicFrontImage(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      CNIC Back Picture
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
                        onChange={(e) =>
                          setCnicBackImage(e.target.files?.[0] || null)
                        }
                      />
                    </label>
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
