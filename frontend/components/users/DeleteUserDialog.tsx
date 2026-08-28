"use client";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import type { User } from "@/types/user";
export default function DeleteUserDialog({
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
      title="Delete user?"
      description={`This permanently removes ${user.name}'s account and cannot be undone.`}
      confirmText="Delete user"
    />
  );
}
