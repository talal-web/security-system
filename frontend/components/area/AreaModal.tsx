"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";

import Modal from "@/components/ui/Modal";
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
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Area Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="area-name"
              type="text"
              placeholder="e.g. Blue World City"
              {...register("name", {
                required: "Area name is required",
                validate: (value) => !!value.trim() || "Area name is required",
              })}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="area-description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Description
          </label>

          <textarea
            id="area-description"
            rows={4}
            placeholder="Enter a short description of this area..."
            {...register("description")}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={createArea.isPending}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createArea.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createArea.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {createArea.isPending ? "Creating..." : "Create Area"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
