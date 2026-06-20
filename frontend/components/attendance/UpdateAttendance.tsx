"use client";

import { useUpdateAttendance } from "@/hooks/attendance/useAttendance";

export default function UpdateAttendanceButton({
  attendanceId,
}: {
  attendanceId: string;
}) {
  const updateAttendance = useUpdateAttendance();

  const handleUpdate = () => {
    updateAttendance.mutate({
      id: attendanceId,
      payload: {
        status: "leave",
        remarks: "Approved leave",
      },
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateAttendance.isPending}>
      Update
    </button>
  );
}
