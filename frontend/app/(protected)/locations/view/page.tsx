import LocationView from "@/components/locations/view/LocationView";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { PageContainer } from "@/components/ui/PageHeader";

export default function Page() {
  return (
    <ProtectedRoute
      allowedRoles={["developer", "admin", "clerk", "supervisor"]}
    >
      <PageContainer>
        <LocationView />
      </PageContainer>
    </ProtectedRoute>
  );
}
