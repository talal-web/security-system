"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";
import type { CreateSectorPayload } from "@/types/sector";

const sectorSchema = z.object({
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
    .transform((value) => (value ? value : undefined)),
});

type SectorFormInput = z.input<typeof sectorSchema>;
type SectorFormData = z.output<typeof sectorSchema>;

export default function CreateSectorForm() {
  const router = useRouter();

  const { mutate, isPending } = useCreateSector();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SectorFormInput, unknown, SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const onSubmit = (data: SectorFormData) => {
    const payload: CreateSectorPayload = {
      name: data.name,
      code: data.code,
      ...(data.description ? { description: data.description } : {}),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Sector created successfully.");
        router.push("/sectors/view");
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error) || "Failed to create sector.");
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">Create Sector</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">Sector Name</label>

          <input
            {...register("name")}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
            placeholder="Zone 1 A"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Code */}
        <div>
          <label className="mb-2 block text-sm font-medium">Sector Code</label>

          <input {...register("code")} placeholder="ZONE_1_A" />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>

          <textarea
            {...register("description")}
            rows={4}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-600"
            placeholder="Optional description..."
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Sector"}
        </button>
      </form>
    </div>
  );
}
