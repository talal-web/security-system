export const formatAttendanceStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    present: "Present",
    absent: "Absent",
    leave: "Leave",
  };

  return statusMap[status ?? ""] ?? "-";
};

export const formatAttendanceShift = (shift?: string) => {
  const shiftMap: Record<string, string> = {
    day: "Day",
    night: "Night",
  };

  return shiftMap[shift ?? ""] ?? "-";
};
