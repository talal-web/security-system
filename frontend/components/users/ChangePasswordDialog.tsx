"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15";
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
        <div>
          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            className={fieldClass}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("confirm")}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            className={fieldClass}
          />
          {errors.confirm && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.confirm.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Modal>
  );
}
