import { Attendance } from "./types";
import { calculateStats } from "./calculateStats";

type GroupedAttendance = Record<
  string,
  {
    records: Attendance[];
    stats: ReturnType<typeof calculateStats>;
  }
>;

export function groupBySector(data: Attendance[]) {
  return data.reduce<GroupedAttendance>((acc, item) => {
    const sector = item.location?.sector || "Unknown Sector";

    if (!acc[sector]) {
      acc[sector] = {
        records: [],
        stats: calculateStats([]),
      };
    }

    acc[sector].records.push(item);
    acc[sector].stats = calculateStats(acc[sector].records);

    return acc;
  }, {});
}
