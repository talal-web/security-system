"use client";

import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/Button";

interface DeleteSectorButtonProps {
  id: string;
}

export default function DeleteSectorButton({ id }: DeleteSectorButtonProps) {
  const router = useRouter();

  const { mutate, isPending } = useDeleteSector();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this sector? This action cannot be undone.",
    );

    if (!confirmed) return;

    mutate(id, {
      onSuccess: () => {
        toast.success("Sector deleted successfully.");
        router.push("/sectors/view");
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error) || "Failed to delete sector.");
      },
    });
  };

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isPending}
      className="min-w-36"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 />
          Delete Sector
        </>
      )}
    </Button>
  );
}
