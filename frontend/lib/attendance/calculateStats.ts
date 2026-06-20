import { Attendance, Stats } from "./types";

export function calculateStats(data: Attendance[]): Stats {
  return data.reduce(
    (acc, item) => {
      acc.total += 1;

      if (item.status === "present") acc.present += 1;
      else if (item.status === "absent") acc.absent += 1;
      else acc.leave += 1;

      if (item.shift === "day") acc.day += 1;
      if (item.shift === "night") acc.night += 1;

      return acc;
    },
    { total: 0, present: 0, absent: 0, leave: 0, day: 0, night: 0 },
  );
}
