"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Save, UsersRound } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useAreas } from "@/hooks/area/useArea";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user";

const schema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),

  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  password: z.string().optional(),

  role: z.enum(["developer", "admin", "clerk", "supervisor"]),

  areas: z.array(z.string()),

  isActive: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function UserForm({
  user,
  isSelf = false,
  embedded = false,
  isPending,
  onSubmit,
}: {
  user?: User;
  isSelf?: boolean;
  embedded?: boolean;
  isPending: boolean;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { data: areaOptions = [] } = useAreas({ isActive: true });

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),

    defaultValues: {
      userId: user?.userId ?? "",
      name: user?.name ?? "",
      password: "",
      role: user?.role ?? "clerk",
      areas: user?.areas ?? [],
      isActive: user?.isActive ?? true,
    },
  });

  const selectedRole = useWatch({ control, name: "role" });
  const selectedAreas = useWatch({ control, name: "areas" }) ?? [];

  const submit = (values: Values) => {
    /*
     * CREATE
     */
    if (!user) {
      if (!values.password || values.password.length < 6) {
        setError("password", {
          message: "Password must be at least 6 characters",
        });

        return;
      }

      if (
        ["clerk", "supervisor"].includes(values.role) &&
        values.areas.length === 0
      ) {
        setError("areas", {
          message: "Select at least one area for this role",
        });

        return;
      }

      const createPayload: CreateUserPayload = {
        userId: values.userId,
        name: values.name,
        password: values.password,
        role: values.role,
        areas:
          values.role === "admin" || values.role === "developer"
            ? []
            : values.areas,
        isActive: values.isActive,
      };

      onSubmit(createPayload);

      return;
    }

    /*
     * UPDATE OWN ACCOUNT
     *
     * Only send name.
     * Do NOT send role or isActive.
     */
    if (isSelf) {
      const selfUpdatePayload: UpdateUserPayload = {
        name: values.name,
      };

      onSubmit(selfUpdatePayload);

      return;
    }

    /*
     * UPDATE ANOTHER USER
     *
     * Role and status can be submitted.
     * Backend still enforces whether the current
     * user is actually allowed to modify them.
     */
    const updatePayload: UpdateUserPayload = {
      name: values.name,
      role: values.role,
      areas:
        values.role === "admin" || values.role === "developer"
          ? []
          : values.areas,
      isActive: values.isActive,
    };

    onSubmit(updatePayload);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={
        embedded
          ? "space-y-4"
          : "space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      {!user && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-blue-50 px-3 py-2.5">
          <p className="text-sm text-slate-700">
            Set up login details and choose the right access.
          </p>
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
            {selectedRole}
          </span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {/* User ID */}
        <Field label="User ID" error={errors.userId?.message}>
          <input
            {...register("userId")}
            disabled={Boolean(user)}
            placeholder="e.g. supervisor01"
            autoComplete="username"
            className="field"
          />
        </Field>

        {/* Name */}
        <Field label="Full name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Full name"
            autoComplete="name"
            className="field"
          />
        </Field>

        {/* Password - CREATE ONLY */}
        {!user && (
          <Field label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="field pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>
        )}

        {/* Role */}
        {!user || !isSelf ? (
          <Field label="Role" error={errors.role?.message}>
            <select
              {...register("role")}
              className="field"
              disabled={user?.role === "developer"}
            >
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
              <option value="clerk">Clerk</option>
              <option value="supervisor">Supervisor</option>
            </select>

            {user?.role === "developer" && (
              <p className="mt-1 text-xs text-slate-500">
                Developer role cannot be changed.
              </p>
            )}
          </Field>
        ) : null}
      </div>

      {!user || !isSelf ? (
        <Field label="Assigned areas" error={errors.areas?.message}>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
            {selectedRole === "admin" || selectedRole === "developer"
              ? "This role has access across all areas."
              : "Choose the areas this account can access."}
          </div>
          {areaOptions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
              No active areas available.
            </p>
          ) : (
            <div className="grid max-h-36 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {areaOptions.map((area) => {
                const checked = selectedAreas.includes(area._id);
                const disabled =
                  selectedRole === "admin" || selectedRole === "developer";
                return (
                  <label
                    key={area._id}
                    className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${checked ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(event) => {
                        const nextAreas = event.target.checked
                          ? [...selectedAreas, area._id]
                          : selectedAreas.filter((id) => id !== area._id);
                        setValue("areas", nextAreas, { shouldValidate: true });
                      }}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                    />
                    <span className="truncate">{area.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </Field>
      ) : null}

      {/* Account Status */}
      {user && !isSelf && (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            {...register("isActive")}
            disabled={user.role === "developer"}
            className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          />
          Active account
          {user.role === "developer" && (
            <span className="text-xs font-normal text-slate-500">
              (Developer status cannot be changed)
            </span>
          )}
        </label>
      )}

      {/* Self information */}
      {user && isSelf && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500">Role: </span>
              <span className="font-semibold capitalize text-slate-800">
                {user.role}
              </span>
            </div>

            <div>
              <span className="text-slate-500">Status: </span>
              <span
                className={`font-semibold ${
                  user.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save className="h-4 w-4" />

        {isPending ? "Saving..." : user ? "Save Changes" : "Create User"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-slate-700">
        {label}
      </div>

      {children}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
