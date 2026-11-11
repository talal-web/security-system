"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";
import AreaSelect from "@/components/area/AreaSelect";
import { useSelectedArea } from "@/components/area/AreaContext";
import type { CreateSectorPayload } from "@/types/sector";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const textareaClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const selectWrapperClasses =
  "flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-card transition-[border-color,box-shadow] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-500/15";

const errorClasses = "mt-1 text-xs font-medium text-red-600";

const sectorSchema = z.object({
  area: z.string().min(1, "Area is required"),

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
  const { selectedAreaId } = useSelectedArea();

  const { mutate, isPending } = useCreateSector();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SectorFormInput, unknown, SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      area: "",
      name: "",
      code: "",
      description: "",
    },
  });
  const area = useWatch({ control, name: "area" });

  useEffect(() => {
    if (selectedAreaId && area !== selectedAreaId) {
      setValue("area", selectedAreaId, { shouldValidate: true });
    }
  }, [selectedAreaId, area, setValue]);

  const onSubmit = (data: SectorFormData) => {
    const payload: CreateSectorPayload = {
      area: data.area,
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
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader title="Create Sector" icon={Layers} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <div>
            <AreaSelect
              showLabel={true}
              label="Area"
              placeholder="Select an area"
              useGlobalSelection
              value={area ?? ""}
              onChange={(event) => setValue("area", event.target.value)}
              wrapperClassName={selectWrapperClasses}
            />

            {errors.area && (
              <p className={errorClasses}>{errors.area.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className={labelClasses}>Sector Name</label>

              <input
                {...register("name")}
                className={inputClasses}
                placeholder="Zone 1 A"
              />

              {errors.name && (
                <p className={errorClasses}>{errors.name.message}</p>
              )}
            </div>

            {/* Code */}
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

          {/* Description */}
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
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Creating..." : "Create Sector"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
