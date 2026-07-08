export type Attendance = {
  _id: string;
  status: "present" | "absent" | "leave";
  shift: "day" | "night";
  location?: { name?: string; sector?: string };
  employee?: { name?: string; fatherName?: string };
};

export type Stats = {
  total: number;
  present: number;
  absent: number;
  leave: number;
  day: number;
  night: number;
};
