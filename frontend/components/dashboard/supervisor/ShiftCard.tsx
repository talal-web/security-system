// components/dashboard/supervisor/ShiftCard.tsx
"use client";

type ShiftCardProps = {
  guardName: string;
  shift: string;
  location: string;
  status: "On Duty" | "Off Duty";
};

export default function ShiftCard({
  guardName,
  shift,
  location,
  status,
}: ShiftCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{guardName}</h3>

          <p className="mt-1 text-sm text-gray-500">{shift}</p>

          <p className="mt-1 text-xs text-gray-400">{location}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium
          ${
            status === "On Duty"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
