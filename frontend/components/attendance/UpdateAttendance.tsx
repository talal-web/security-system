"use client";

import { Button } from "@/components/ui/Button";

export default function UpdateAttendanceButton({
  attendanceId,
}: {
  attendanceId: string;
}) {
  const handleUpdate = () => {
    console.info(
      "Attendance update is not available in this build.",
      attendanceId,
    );
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleUpdate}>
      Update
    </Button>
  );
}
