"use client";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { User } from "@/types/user";
export default function ChangeStatusDialog({
  user,
  open,
  isPending,
  onClose,
  onConfirm,
}: {
  user: User;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmationModal
      open={open}
      onCancel={onClose}
      onConfirm={onConfirm}
      isLoading={isPending}
      title={`${user.isActive ? "Deactivate" : "Activate"} user?`}
      description={`${user.name} will ${user.isActive ? "no longer be able to access" : "be able to access"} the system.`}
      confirmText={user.isActive ? "Deactivate" : "Activate"}
    />
  );
}
