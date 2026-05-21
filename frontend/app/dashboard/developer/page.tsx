import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function SupervisorPage() {
  return (
    <ProtectedRoute allowedRoles={["developer"]}>
      <div>Developer Dashboard</div>
    </ProtectedRoute>
  );
}
