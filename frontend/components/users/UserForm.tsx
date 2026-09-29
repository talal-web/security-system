"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
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
  isPending,
  onSubmit,
}: {
  user?: User;
  isSelf?: boolean;
  isPending: boolean;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => void;
}) {
  const { data: areaOptions = [] } = useAreas({ isActive: true });

  const {
    register,
    handleSubmit,
    watch,
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

  const selectedRole = watch("role");
  const selectedAreas = watch("areas") ?? [];

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
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* User ID */}
        <Field label="User ID" error={errors.userId?.message}>
          <input
            {...register("userId")}
            disabled={Boolean(user)}
            placeholder="e.g. supervisor01"
            className="field"
          />
        </Field>

        {/* Name */}
        <Field label="Full name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="Full name"
            className="field"
          />
        </Field>

        {/* Password - CREATE ONLY */}
        {!user && (
          <Field label="Password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              className="field"
            />
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
        <Field label="Assigned Areas" error={errors.areas?.message}>
          <select
            multiple
            value={selectedAreas}
            onChange={(event) => {
              const nextAreas = Array.from(
                event.target.selectedOptions,
                (option) => option.value,
              );

              setValue("areas", nextAreas, { shouldValidate: true });
            }}
            disabled={selectedRole === "admin" || selectedRole === "developer"}
            className="field min-h-[120px]"
          >
            {areaOptions.length === 0 ? (
              <option value="">No areas available</option>
            ) : (
              areaOptions.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))
            )}
          </select>

          <p className="mt-1 text-xs text-slate-500">
            {selectedRole === "admin" || selectedRole === "developer"
              ? "Admins and developers do not require area assignments."
              : "Select one or more areas for this role."}
          </p>
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
