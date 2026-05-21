// components/dashboard/UserTable.tsx
"use client";

const users = [
  {
    name: "Talal Malik",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Jawad Ahmad",
    role: "Supervisor",
    status: "Active",
  },
  {
    name: "Ali Khan",
    role: "Developer",
    status: "Inactive",
  },
];

export default function UserTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 text-sm font-semibold text-gray-600">User</th>

            <th className="pb-3 text-sm font-semibold text-gray-600">Role</th>

            <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="py-4 text-sm text-gray-700">{user.name}</td>

              <td className="py-4 text-sm text-gray-700">{user.role}</td>

              <td className="py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium
                  ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
