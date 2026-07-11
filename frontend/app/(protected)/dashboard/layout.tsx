import RoleBasedRedirect from "@/components/authentication/RoleBaseRedirect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedRedirect>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleBasedRedirect>
  );
}
