"use client";

import Modal from "@/components/ui/Modal";
import FineForm from "@/components/fine/FineForm";

import type { Fine, FineEmployee } from "@/types/fine";

interface FineModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  employees?: FineEmployee[];
  fine?: Fine | null;
}

export default function FineModal({
  open,
  onClose,
  employeeId = "",
  employees = [],
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
        employees={employees}
        fine={fine}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
