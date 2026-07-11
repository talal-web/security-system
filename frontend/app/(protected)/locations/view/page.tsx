import LocationView from "@/components/locations/view/LocationView";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["admin", "developer"]}>
      <LocationView />
    </ProtectedRoute>
  );
}
