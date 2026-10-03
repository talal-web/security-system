"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useSector, useUpdateSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UpdateSectorPayload } from "@/types/sector";

const sectorUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Sector name must be at least 2 characters")
    .max(100, "Sector name is too long"),

  code: z
    .string()
    .trim()
    .min(1, "Sector code is required")
    .max(20, "Sector code is too long")
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .transform((value) => (value ? value : "")),

  isActive: z.boolean(),
});

type SectorUpdateInput = z.input<typeof sectorUpdateSchema>;
type SectorUpdateData = z.output<typeof sectorUpdateSchema>;

interface UpdateSectorFormProps {
  id: string;
}

export default function UpdateSectorForm({ id }: UpdateSectorFormProps) {
  const router = useRouter();

  const { data: sectorResponse, isLoading, isError, error } = useSector(id);
  const { mutate, isPending } = useUpdateSector();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectorUpdateInput, unknown, SectorUpdateData>({
    resolver: zodResolver(sectorUpdateSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    const sector = sectorResponse?.data;

    if (!sector) return;

    reset({
      name: sector.name,
      code: sector.code,
      description: sector.description || "",
      isActive: sector.isActive,
    });
  }, [sectorResponse, reset]);

  const onSubmit = (formData: SectorUpdateData) => {
    const payload: UpdateSectorPayload = {
      name: formData.name,
      code: formData.code,
      description: formData.description || "",
      isActive: formData.isActive,
    };

    mutate(
      {
        id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Sector updated successfully.");
          router.push("/sectors/view");
        },
        onError: (mutationError: unknown) => {
          toast.error(
            getApiErrorMessage(mutationError) || "Failed to update sector.",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <p className="text-slate-500">Loading sector...</p>
      </div>
    );
  }

  if (isError || !sectorResponse?.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="font-medium text-red-600">
          {error instanceof Error ? error.message : "Failed to load sector."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Update Sector</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sector Name
          </label>

          <input
            {...register("name")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="Zone 1-A"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sector Code
          </label>

          <input
            {...register("code")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="ZONE_1_A"
          />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="Optional description..."
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            {...register("isActive", {
              setValueAs: (value) => value === "true",
            })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-600"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Link
            href="/sectors/view"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
