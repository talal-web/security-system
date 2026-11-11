import RoleBasedRedirect from "@/components/authentication/RoleBaseRedirect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedRedirect>
      {children}
    </RoleBasedRedirect>
  );
}
