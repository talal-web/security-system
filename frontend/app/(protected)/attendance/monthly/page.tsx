import MonthlyAttendance from "@/components/attendance/monthly/MonthlyAttendance";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

export default function MonthlyAttendancePage() {
  return (
    <ProtectedRoute allowedRoles={["developer", "admin", "clerk"]}>
      <MonthlyAttendance />
    </ProtectedRoute>
  );
}
