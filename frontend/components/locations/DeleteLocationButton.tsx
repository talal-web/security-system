"use client";

import { useRouter } from "next/navigation";

import { Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { useDeleteLocation } from "@/hooks/location/useDeleteLocation";
import { Button } from "@/components/ui/Button";

type Props = {
  id: string;
};

export default function DeleteLocationButton({ id }: Props) {
  const router = useRouter();

  const { removeLocation, isLoading } = useDeleteLocation({
    onSuccess: () => {
      toast.success("Location deleted successfully.");
      router.push("/locations");
    },
    onError: (message) => {
      toast.error(message || "Failed to delete location.");
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
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isLoading}
      className="min-w-36"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 />
          Delete Location
        </>
      )}
    </Button>
  );
}
