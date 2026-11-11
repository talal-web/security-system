interface MonthlyAttendanceHeaderProps {
  days: number[];
}

const stickyTh =
  "sticky z-40 border border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-medium text-slate-500";

const th =
  "border border-slate-200 px-2 py-3 text-center text-xs font-medium text-slate-500";

export default function MonthlyAttendanceHeader({
  days,
}: MonthlyAttendanceHeaderProps) {
  return (
    <thead className="bg-slate-50">
      <tr>
        {/* ========================= */}
        {/* STICKY EMPLOYEE COLUMNS */}
        {/* ========================= */}

        <th className={`${stickyTh} left-0 min-w-22.5`}>Emp ID</th>

        <th className={`${stickyTh} left-22.5 min-w-45`}>Name</th>

        <th className={`${stickyTh} left-67.5 min-w-45`}>Father Name</th>

        <th className={`${stickyTh} left-112.5 min-w-35`}>Designation</th>

        {/* ========================= */}
        {/* DAYS */}
        {/* ========================= */}

        {days.map((day) => (
          <th key={day} className={`${th} min-w-13 tabular-nums`}>
            {day}
          </th>
        ))}

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}

        <th className={`${th} min-w-15`}>P</th>

        <th className={`${th} min-w-15`}>L</th>

        <th className={`${th} min-w-15`}>A</th>

        <th className={`${th} min-w-17.5`}>Total</th>
      </tr>
    </thead>
  );
}
