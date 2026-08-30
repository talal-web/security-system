"use client";

import Modal from "@/components/ui/Modal";
import FineForm from "@/components/fine/FineForm";

import type { Fine } from "@/types/fine";

interface FineModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  fine?: Fine | null;
}

export default function FineModal({
  open,
  onClose,
  employeeId = "",
  fine = null,
}: FineModalProps) {
  const isEditing = Boolean(fine);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Correct Fine" : "Create Fine"}
    >
      <FineForm
        employeeId={employeeId}
        fine={fine}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
