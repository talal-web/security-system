"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateArea } from "@/hooks/area/useArea";
import type { CreateAreaRequest } from "@/types/area";

interface AreaCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AreaCreateModal({
  open,
  onClose,
}: AreaCreateModalProps) {
  const createArea = useCreateArea();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAreaRequest>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateAreaRequest) => {
    try {
      await createArea.mutateAsync({
        name: data.name.trim(),
        description: data.description?.trim() || "",
      });

      toast.success("Area created successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create area",
      );
    }
  };

  const handleClose = () => {
    if (createArea.isPending) return;
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create New Area">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Area Name */}
        <div>
          <label
            htmlFor="area-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Area Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              id="area-name"
              type="text"
              placeholder="e.g. Blue World City"
              {...register("name", {
                required: "Area name is required",
                validate: (value) => !!value.trim() || "Area name is required",
              })}
              className={`h-9 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 focus:outline-none focus:ring-3 ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/15"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="area-description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="area-description"
            rows={4}
            placeholder="Enter a short description of this area..."
            {...register("description")}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={createArea.isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={createArea.isPending}>
            {createArea.isPending && <Loader2 className="animate-spin" />}
            {createArea.isPending ? "Creating..." : "Create Area"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
