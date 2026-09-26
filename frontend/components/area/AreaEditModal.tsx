"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MapPin, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUpdateArea } from "@/hooks/area/useArea";
import type { Area } from "@/types/area";

interface AreaEditModalProps {
  open: boolean;
  area: Area;
  onClose: () => void;
}

interface AreaFormValues {
  name: string;
  description: string;
}

export default function AreaEditModal({
  open,
  area,
  onClose,
}: AreaEditModalProps) {
  const updateMutation = useUpdateArea();
  const isSaving = updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<AreaFormValues>({
    defaultValues: {
      name: area.name,
      description: area.description ?? "",
    },
  });

  const description =
    useWatch({
      control,
      name: "description",
    }) ?? "";

  // Reset fields whenever the modal opens or the selected area changes.
  useEffect(() => {
    if (open) {
      reset({
        name: area.name,
        description: area.description ?? "",
      });
    }
  }, [open, area._id, area.name, area.description, reset]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isSaving, onClose]);

  if (!open) return null;

  const onSubmit = (values: AreaFormValues) => {
    const name = values.name.trim();
    const description = values.description.trim();

    updateMutation.mutate(
      {
        id: area._id,
        payload: {
          name,
          description,
        },
      },
      {
        onSuccess: () => {
          toast.success("Area updated successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update area");
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-area-title"
        className="
    flex
    max-h-[92dvh]
    w-[calc(100%-2rem)]
    max-w-lg
    flex-col
    overflow-hidden
    rounded-2xl
    bg-white
    shadow-2xl
    sm:w-full
  "
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={21} />
            </div>

            <div className="min-w-0">
              <h2
                id="edit-area-title"
                className="text-lg font-semibold text-slate-900"
              >
                Edit area
              </h2>
              <p className="mt-1 wrap-break-words text-sm text-slate-500">
                Update the details for {area.name}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit area"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
            {/* Area name */}
            <div>
              <label
                htmlFor="area-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Area name <span className="text-red-500">*</span>
              </label>

              <input
                id="area-name"
                type="text"
                autoFocus
                maxLength={100}
                disabled={isSaving}
                placeholder="e.g. Blue World City"
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Area name is required",
                  validate: (value) =>
                    !!value.trim() || "Area name is required",
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
              />

              {errors.name ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  Choose a clear name for this operational area.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor="area-description"
                  className="block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <span className="text-xs text-slate-400">Optional</span>
              </div>

              <textarea
                id="area-description"
                rows={4}
                maxLength={500}
                disabled={isSaving}
                placeholder="Describe the area or its operations..."
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
              />

              <div className="mt-1 flex items-center justify-between">
                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-slate-400">
                  {description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
