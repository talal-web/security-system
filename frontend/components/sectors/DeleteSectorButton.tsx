"use client";

import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteSector } from "@/hooks/sector/useSector";
import { getApiErrorMessage } from "@/lib/apiError";

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
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-11 min-w-36 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete Sector
        </>
      )}
    </button>
  );
}
