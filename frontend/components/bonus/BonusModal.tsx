"use client";

import Modal from "@/components/ui/Modal";
import BonusForm from "@/components/bonus/BonusForm";

import type { Bonus } from "@/types/bonus";

interface BonusModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  bonus?: Bonus | null;
}

export default function BonusModal({
  open,
  onClose,
  employeeId = "",
  bonus = null,
}: BonusModalProps) {
  const isEditing = Boolean(bonus);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Correct Bonus" : "Create Bonus"}
    >
      <BonusForm
        key={bonus?._id ?? "create"}
        employeeId={employeeId}
        bonus={bonus}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
