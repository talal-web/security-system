// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Overview</h2>

        <p className="text-gray-500">Manage your system from here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Employees</h3>

          <p className="mt-2 text-sm text-gray-500">
            Manage employee information and records.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Attendance</h3>

          <p className="mt-2 text-sm text-gray-500">
            View attendance reports and summaries.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Security Staff</h3>

          <p className="mt-2 text-sm text-gray-500">
            Monitor guards and duty assignments.
          </p>
        </div>
      </div>
    </div>
  );
}
