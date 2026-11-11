"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Save, UsersRound } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAreas } from "@/hooks/area/useArea";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user";

const fieldClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-3 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

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
          ? "space-y-5"
          : "space-y-5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-6"
      }
    >
      {!user && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5">
          <p className="text-sm text-slate-700">
            Set up login details and choose the right access.
          </p>
          <Badge tone="info" className="capitalize">
            {selectedRole}
          </Badge>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* User ID */}
        <Field label="User ID" error={errors.userId?.message}>
          <input
            {...register("userId")}
            disabled={Boolean(user)}
            placeholder="e.g. supervisor01"
            autoComplete="username"
            className={fieldClass}
          />
        </Field>

        {/* Name */}
        <Field label="Full name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Full name"
            autoComplete="name"
            className={fieldClass}
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
                className={`${fieldClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-700"
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
              className={fieldClass}
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
            <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-center text-sm text-slate-500">
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
                    className={`flex min-h-9 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${checked ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
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
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-slate-500">Role: </span>
              <span className="font-medium capitalize text-slate-900">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Status: </span>
              <Badge tone={user.isActive ? "success" : "danger"} dot>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end border-t border-slate-100 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <Save />

          {isPending ? "Saving..." : user ? "Save Changes" : "Create User"}
        </Button>
      </div>
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

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
