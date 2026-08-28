import AttendanceList from "@/components/attendance/view/AttendanceList";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function AttendancePage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <AttendanceList />
    </ProtectedRoute>
  );
}
