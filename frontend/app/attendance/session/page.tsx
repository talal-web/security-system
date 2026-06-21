"use client";

import { useMemo, useState, useEffect } from "react";

import {
  useAttendanceSession,
  useMarkAttendanceSession,
} from "@/hooks/attendance/useAttendanceSession";

import type {
  AttendanceSessionEmployee,
  MarkAttendanceSessionPayload,
} from "@/types/attendance-session";

export default function AttendanceSessionPage() {
  const { data, isLoading, error } = useAttendanceSession();

  const markAttendanceMutation = useMarkAttendanceSession();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [employees, setEmployees] = useState<AttendanceSessionEmployee[]>([]);

  useEffect(() => {
    if (data?.employees) {
      setEmployees(data.employees);
    }
  }, [data]);

  const stats = useMemo(() => {
    return {
      total: employees.length,
      present: employees.filter((e) => e.status === "present").length,
      absent: employees.filter((e) => e.status === "absent").length,
      leave: employees.filter((e) => e.status === "leave").length,
    };
  }, [employees]);

  const updateEmployee = (
    employeeId: string,
    field: keyof AttendanceSessionEmployee,
    value: unknown,
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === employeeId
          ? {
              ...emp,
              [field]: value,
            }
          : emp,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      const payload: MarkAttendanceSessionPayload = {
        date,
        employees: employees.map((emp) => ({
          employeeId: emp.employeeId,
          locationId: emp.selectedLocation,
          status: emp.status,
          shift: emp.shift,
          remarks: emp.remarks,
        })),
      };

      await markAttendanceMutation.mutateAsync(payload);

      alert("Attendance marked successfully");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to mark attendance",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading attendance session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance Session</h1>
          <p className="text-sm text-gray-500">
            Mark attendance for all employees
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border px-4 py-2"
          />

          <button
            onClick={handleSubmit}
            disabled={markAttendanceMutation.isPending}
            className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
          >
            {markAttendanceMutation.isPending ? "Saving..." : "Mark Attendance"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Present" value={stats.present} />
        <StatCard title="Absent" value={stats.absent} />
        <StatCard title="Leave" value={stats.leave} />
      </div>

      {/* EMPLOYEE CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => {
          const availableLocations =
            data?.locations.filter(
              (location) => location.sector === employee.sector,
            ) ?? [];

          return (
            <div
              key={employee.employeeId}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {/* INFO */}
              <div className="mb-4">
                <h3 className="font-semibold">{employee.name}</h3>

                <p className="text-sm text-gray-500">
                  Father: {employee.fatherName}
                </p>

                <p className="text-sm text-gray-500">
                  Sector: {employee.sector}
                </p>

                <p className="text-sm text-gray-500">
                  Current Location:{" "}
                  {employee.currentLocation?.name ?? "Not Assigned"}
                </p>
              </div>

              <div className="space-y-3">
                {/* LOCATION */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Location
                  </label>

                  <select
                    value={employee.selectedLocation ?? ""}
                    onChange={(e) =>
                      updateEmployee(
                        employee.employeeId,
                        "selectedLocation",
                        e.target.value || null,
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Select Location</option>

                    {availableLocations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={employee.status}
                    onChange={(e) =>
                      updateEmployee(
                        employee.employeeId,
                        "status",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="present">Present</option>

                    <option value="absent">Absent</option>

                    <option value="leave">Leave</option>
                  </select>
                </div>

                {/* SHIFT */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Shift
                  </label>

                  <select
                    value={employee.shift}
                    onChange={(e) =>
                      updateEmployee(
                        employee.employeeId,
                        "shift",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                {/* REMARKS */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Remarks
                  </label>

                  <textarea
                    rows={2}
                    value={employee.remarks}
                    onChange={(e) =>
                      updateEmployee(
                        employee.employeeId,
                        "remarks",
                        e.target.value,
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="Optional remarks..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-1 text-2xl font-bold">{value}</h2>
    </div>
  );
}
