import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import ViewSectors from "@/components/sectors/ViewSectors";

export default function ViewSectorsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <ViewSectors />
    </ProtectedRoute>
  );
}
