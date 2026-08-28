import LocationView from "@/components/locations/view/LocationView";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <LocationView />
    </ProtectedRoute>
  );
}
