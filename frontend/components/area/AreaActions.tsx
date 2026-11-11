"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteArea } from "@/hooks/area/useArea";
import type { Area } from "@/types/area";

import AreaEditModal from "@/components/area/AreaEditModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/Button";

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setEditOpen(true)}
          aria-label={`Edit ${area.name}`}
        >
          <Pencil />
          <span>Edit</span>
        </Button>

        <Button
          variant="danger-soft"
          size="sm"
          onClick={() => setConfirmOpen(true)}
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${area.name}`}
        >
          <Trash2 />
          <span>Delete</span>
        </Button>
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
