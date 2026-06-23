interface Props {
  total: number;
  present: number;
  absent: number;
  leave: number;
}

export default function AttendanceStats({
  total,
  present,
  absent,
  leave,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total" value={total} />
      <StatCard title="Present" value={present} />
      <StatCard title="Absent" value={absent} />
      <StatCard title="Leave" value={leave} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-1 text-2xl font-bold">{value}</h2>
    </div>
  );
}
