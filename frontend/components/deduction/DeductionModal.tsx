"use client";

import Modal from "@/components/ui/Modal";
import DeductionForm from "@/components/deduction/DeductionForm";

import type { Deduction } from "@/types/deduction";

interface DeductionModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  deduction?: Deduction | null;
}

export default function DeductionModal({
  open,
  onClose,
  employeeId = "",
  deduction = null,
}: DeductionModalProps) {
  const isEditing = Boolean(deduction);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Correct Deduction" : "Create Deduction"}
    >
      <DeductionForm
        key={deduction?._id ?? "create"}
        employeeId={employeeId}
        deduction={deduction}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
