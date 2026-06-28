"use client";

import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { useDeleteLocation } from "@/hooks/location/useDeleteLocation";

type Props = {
  id: string;
};

export default function DeleteLocationButton({ id }: Props) {
  const router = useRouter();

  const { removeLocation, isLoading } = useDeleteLocation({
    onSuccess: () => {
      toast.success("Location deleted successfully");
      router.push("/locations");
    },
    onError: (message) => {
      toast.error(message);
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this location?",
    );

    if (!confirmed) return;

    removeLocation(id);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isLoading}
      className="
        inline-flex h-12 items-center justify-center gap-2
        rounded-2xl bg-red-600 px-5
        text-sm font-semibold text-white
        shadow-lg shadow-red-600/30
        transition-all duration-300
        hover:scale-[1.02] hover:bg-red-700
        disabled:cursor-not-allowed
        disabled:opacity-70
      "
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete
        </>
      )}
    </button>
  );
}
