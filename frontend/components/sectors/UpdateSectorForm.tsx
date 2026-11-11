"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useSector, useUpdateSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";
import type { UpdateSectorPayload } from "@/types/sector";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { ErrorState, LoadingState } from "@/components/ui/States";

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const textareaClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const errorClasses = "mt-1 text-xs font-medium text-red-600";

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
      <LoadingState
        title="Loading sector..."
        className="mx-auto min-h-72 w-full max-w-2xl"
      />
    );
  }

  if (isError || !sectorResponse?.data) {
    return (
      <ErrorState
        className="mx-auto w-full max-w-2xl"
        title={
          error instanceof Error ? error.message : "Failed to load sector."
        }
      />
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader title="Update Sector" icon={Layers} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Sector Name</label>

              <input
                {...register("name")}
                className={inputClasses}
                placeholder="Zone 1-A"
              />

              {errors.name && (
                <p className={errorClasses}>{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Sector Code</label>

              <input
                {...register("code")}
                className={`${inputClasses} font-mono`}
                placeholder="ZONE_1_A"
              />

              {errors.code && (
                <p className={errorClasses}>{errors.code.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Description</label>

            <textarea
              {...register("description")}
              rows={4}
              className={textareaClasses}
              placeholder="Optional description..."
            />

            {errors.description && (
              <p className={errorClasses}>{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Status</label>

            <select
              {...register("isActive", {
                setValueAs: (value) => value === "true",
              })}
              className={inputClasses}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="flex-col-reverse sm:flex-row">
          <ButtonLink
            href="/sectors/view"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Cancel
          </ButtonLink>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
