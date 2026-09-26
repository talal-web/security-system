"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteArea } from "@/hooks/area/useArea";
import type { Area } from "@/types/area";

import AreaEditModal from "@/components/area/AreaEditModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface AreaActionsProps {
  area: Area;
}

export default function AreaActions({ area }: AreaActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteMutation = useDeleteArea();

  const handleDelete = () => {
    deleteMutation.mutate(area._id, {
      onSuccess: () => {
        toast.success("Area deleted successfully");
        setConfirmOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete area");
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          aria-label={`Edit ${area.name}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Pencil size={15} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${area.name}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>

      <AreaEditModal
        open={editOpen}
        area={area}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmationModal
        open={confirmOpen}
        title="Delete area?"
        description={`Are you sure you want to delete "${area.name}"? This action cannot be undone. Make sure no employees or records still depend on this area.`}
        confirmText="Delete area"
        cancelText="Keep area"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
