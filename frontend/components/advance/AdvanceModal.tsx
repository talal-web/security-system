"use client";

import Modal from "../ui/Modal";
import AdvanceForm from "@/components/advance/AdvanceForm";

import type { Advance } from "@/types/advance";

interface AdvanceModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  advance?: Advance | null;
}

export default function AdvanceModal({
  open,
  onClose,
  employeeId = "",
  advance = null,
}: AdvanceModalProps) {
  const isEditing = Boolean(advance);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Correct Advance" : "Create Advance"}
    >
      <AdvanceForm
        key={advance?._id ?? `new-${employeeId}`}
        employeeId={employeeId}
        advance={advance}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
