// app/dashboard/admin/page.tsx
"use client";

import {
  Users,
  Shield,
  Activity,
  DollarSign,
  UserPlus,
  Settings,
  UserCog,
} from "lucide-react";

import StatCard from "@/components/dashboard/admin/StatCard";
import SectionCard from "@/components/dashboard/admin/SectionCard";
import ActivityItem from "@/components/dashboard/admin/ActivityItem";
import QuickActionButton from "@/components/dashboard/admin/QuickActionButton";
import UserTable from "@/components/dashboard/admin/UserTable";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

const activities = [
  {
    title: "New employee registered",
    time: "2 min ago",
  },
  {
    title: "Admin updated security settings",
    time: "10 min ago",
  },
  {
    title: "Database backup completed",
    time: "25 min ago",
  },
  {
    title: "Supervisor assigned new task",
    time: "1 hour ago",
  },
];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Admin Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage users, monitor system activity and overview analytics
              </p>
            </div>

            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800">
              Generate Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              value="420"
              description="Platform registered users"
              icon={<Users size={22} />}
              trend="+12% this month"
            />

            <StatCard
              title="Admins"
              value="3"
              description="System administrators"
              icon={<Shield size={22} />}
              trend="+2 added"
            />

            <StatCard
              title="System Uptime"
              value="99.9%"
              description="Stable server performance"
              icon={<Activity size={22} />}
              trend="Excellent"
            />

            <StatCard
              title="Revenue"
              value="Rs.2,40,500"
              description="Monthly revenue"
              icon={<DollarSign size={22} />}
              trend="+18% growth"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Activity */}
            <div className="xl:col-span-2">
              <SectionCard
                title="Recent Activity"
                action={
                  <button className="text-sm font-medium text-black">
                    View All
                  </button>
                }
              >
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      title={activity.title}
                      time={activity.time}
                    />
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Quick Actions */}
            <div>
              <SectionCard title="Quick Actions">
                <div className="grid gap-3">
                  <QuickActionButton
                    title="Add New User"
                    href="/employees/create"
                    primary
                  />

                  <QuickActionButton
                    title="Manage Roles"
                    href="/dashboard/roles"
                  />

                  <QuickActionButton
                    title="System Settings"
                    href="/dashboard/settings"
                  />

                  <QuickActionButton
                    title="Manage Employees"
                    href="/employees"
                  />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-gray-100 p-4 text-center">
                    <UserPlus className="mx-auto mb-2" size={18} />
                    <p className="text-xs text-gray-600">Add User</p>
                  </div>

                  <div className="rounded-xl bg-gray-100 p-4 text-center">
                    <UserCog className="mx-auto mb-2" size={18} />
                    <p className="text-xs text-gray-600">Roles</p>
                  </div>

                  <div className="rounded-xl bg-gray-100 p-4 text-center">
                    <Settings className="mx-auto mb-2" size={18} />
                    <p className="text-xs text-gray-600">Settings</p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Users Table */}
          <SectionCard
            title="Latest Users"
            action={
              <button className="text-sm font-medium text-black">
                View Users
              </button>
            }
          >
            <UserTable />
          </SectionCard>
        </div>
      </div>
    </ProtectedRoute>
  );
}
