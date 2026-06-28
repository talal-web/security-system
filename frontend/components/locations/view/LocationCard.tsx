"use client";

import Link from "next/link";

import { MapPin, Pencil } from "lucide-react";

import { ILocation } from "@/types/location";

interface LocationCardProps {
  location: ILocation;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-600" size={18} />

          <h3 className="font-semibold text-slate-800">{location.name}</h3>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[11px] font-medium ${
            location.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {location.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {location.address || "No address provided"}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        ID: {location._id.slice(-6)}
      </p>

      <div className="mt-4 flex justify-end">
        <Link
          href={`/locations/${location._id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700 transition hover:bg-blue-100"
        >
          <Pencil size={14} />
          Edit
        </Link>
      </div>
    </div>
  );
}
