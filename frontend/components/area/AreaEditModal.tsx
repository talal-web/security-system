"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { MapPin, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px] animate-in fade-in duration-150 sm:p-6"
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
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
              <MapPin className="size-4" />
            </div>

            <div className="min-w-0">
              <h2
                id="edit-area-title"
                className="text-base font-semibold leading-6 text-slate-900"
              >
                Edit area
              </h2>
              <p className="mt-0.5 wrap-break-word text-sm text-slate-500">
                Update the details for {area.name}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close edit area"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Area name */}
            <div>
              <label
                htmlFor="area-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
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
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:bg-slate-50"
              />

              {errors.name ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-500">
                  Choose a clear name for this operational area.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="area-description"
                  className="block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <span className="text-xs text-slate-500">Optional</span>
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
                className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 shadow-card transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:bg-slate-50"
              />

              <div className="mt-1.5 flex items-center justify-between">
                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs tabular-nums text-slate-500">
                  {description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
