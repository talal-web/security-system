"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import LoginForm from "./LoginForm";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose} title="Secure Login">
      <LoginForm
        onSuccess={() => {
          onClose();
          router.push("/dashboard");
        }}
      />
    </Modal>
  );
}
