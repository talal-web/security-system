"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { useLogin } from "@/hooks/auth/useLogin";

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
    } catch (error) {
      // mutation handles error state
    }
  };

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>

        <p className="text-sm text-gray-500">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* USER ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium">User ID</label>

          <input
            type="text"
            placeholder="Enter user ID"
            {...register("userId", {
              required: "User ID is required",
            })}
            className="w-full rounded-lg border p-3 outline-none transition focus:border-black"
          />

          {errors.userId && (
            <p className="text-sm text-red-500">{errors.userId.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>

          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full rounded-lg border p-3 outline-none transition focus:border-black"
          />

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* API ERROR */}
        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error instanceof Error ? error.message : "Something went wrong"}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-black p-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
