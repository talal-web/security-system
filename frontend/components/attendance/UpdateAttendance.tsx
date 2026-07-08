"use client";

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

  return <button onClick={handleUpdate}>Update</button>;
}
