"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
type Values = z.infer<typeof schema>;
export default function ChangePasswordDialog({
  open,
  isPending,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  return (
    <Modal open={open} onClose={onClose} title="Change password">
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data.password);
          reset();
        })}
        className="space-y-4"
      >
        <p className="text-sm text-slate-500">
          The password is never displayed after submission.
        </p>
        <input
          {...register("password")}
          type="password"
          autoComplete="new-password"
          placeholder="New password"
          className="field"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
        <input
          {...register("confirm")}
          type="password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          className="field"
        />
        {errors.confirm && (
          <p className="text-xs text-red-600">{errors.confirm.message}</p>
        )}
        <button
          disabled={isPending}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Update password"}
        </button>
      </form>
    </Modal>
  );
}
