// app/dashboard/supervisor/page.tsx
"use client";

import { ShieldCheck, ClipboardList, Users, Siren } from "lucide-react";

import SupervisorStatCard from "@/components/dashboard/supervisor/StatCard";

import ShiftCard from "@/components/dashboard/supervisor/ShiftCard";

import IncidentItem from "@/components/dashboard/supervisor/IncidentItem";

import QuickActionCard from "@/components/dashboard/supervisor/QuickActionCard";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

const shifts = [
  {
    guardName: "Ali Khan",
    shift: "Morning Shift",
    location: "Gate No. 2",
    status: "On Duty" as const,
  },
  {
    guardName: "Jawad Ahmad",
    shift: "Night Shift",
    location: "Main Entrance",
    status: "On Duty" as const,
  },
  {
    guardName: "Usman Tariq",
    shift: "Evening Shift",
    location: "Parking Area",
    status: "Off Duty" as const,
  },
];

const incidents = [
  {
    title: "Unauthorized vehicle entry attempt",
    time: "15 min ago",
  },
  {
    title: "Visitor pass verification completed",
    time: "35 min ago",
  },
  {
    title: "Guard shift updated successfully",
    time: "1 hour ago",
  },
];

export default function SupervisorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "supervisor", "developer"]}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Supervisor Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor guards, shifts and security activities
              </p>
            </div>

            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800">
              Generate Shift Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SupervisorStatCard
              title="Total Guards"
              value="48"
              description="Registered security guards"
              icon={<Users size={22} />}
            />

            <SupervisorStatCard
              title="On Duty"
              value="32"
              description="Currently active guards"
              icon={<ShieldCheck size={22} />}
            />

            <SupervisorStatCard
              title="Assigned Shifts"
              value="18"
              description="Today shift assignments"
              icon={<ClipboardList size={22} />}
            />

            <SupervisorStatCard
              title="Incidents"
              value="3"
              description="Reported today"
              icon={<Siren size={22} />}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Shift Overview */}
            <div className="xl:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Active Shift Overview
                </h2>

                <button className="text-sm font-medium text-black">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {shifts.map((shift, index) => (
                  <ShiftCard
                    key={index}
                    guardName={shift.guardName}
                    shift={shift.shift}
                    location={shift.location}
                    status={shift.status}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="grid gap-3">
                <QuickActionCard
                  title="Assign New Shift"
                  href="/dashboard/shifts/create"
                />

                <QuickActionCard
                  title="Manage Guards"
                  href="/dashboard/guards"
                />

                <QuickActionCard
                  title="View Attendance"
                  href="/dashboard/attendance"
                />

                <QuickActionCard
                  title="Report Incident"
                  href="/dashboard/incidents/create"
                />
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Incidents
              </h2>

              <button className="text-sm font-medium text-black">
                View Reports
              </button>
            </div>

            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <IncidentItem
                  key={index}
                  title={incident.title}
                  time={incident.time}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
