"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { AlertCircle } from "lucide-react";

import { useLogin } from "@/hooks/auth/useLogin";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClasses =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15";

const errorClasses = "mt-1 text-xs font-medium text-red-600";

type LoginFormProps = {
  onSuccess?: () => void;
};

type LoginFormData = {
  userId: string;
  password: string;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();

  const { mutateAsync, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await mutateAsync(data);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch {}
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Login
        </h1>

        <p className="text-sm text-slate-500">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* USER ID */}
        <div>
          <label className={labelClasses}>User ID</label>

          <input
            type="text"
            placeholder="Enter user ID"
            {...register("userId", {
              required: "User ID is required",
            })}
            className={cn(
              inputClasses,
              errors.userId &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/15",
            )}
          />

          {errors.userId && (
            <p className={errorClasses}>{errors.userId.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className={labelClasses}>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
            })}
            className={cn(
              inputClasses,
              errors.password &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/15",
            )}
          />

          {errors.password && (
            <p className={errorClasses}>{errors.password.message}</p>
          )}
        </div>

        {/* API ERROR */}
        {isError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            {error instanceof Error ? error.message : "Something went wrong"}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
