interface MonthlyAttendanceHeaderProps {
  days: number[];
}

export default function MonthlyAttendanceHeader({
  days,
}: MonthlyAttendanceHeaderProps) {
  return (
    <thead className="bg-gray-100">
      <tr>
        {/* ========================= */}
        {/* STICKY EMPLOYEE COLUMNS */}
        {/* ========================= */}

        <th className="sticky left-0 z-40 min-w-22.5` border bg-gray-100 px-3 py-3 text-left text-sm font-semibold">
          Emp ID
        </th>

        <th className="sticky left-22.5 z-40 min-w-45 border bg-gray-100 px-3 py-3 text-left text-sm font-semibold">
          Name
        </th>

        <th className="sticky left-67.5 z-40 min-w-45 border bg-gray-100 px-3 py-3 text-left text-sm font-semibold">
          Father Name
        </th>

        <th className="sticky left-112.5 z-40 min-w-35 border bg-gray-100 px-3 py-3 text-left text-sm font-semibold">
          Designation
        </th>

        {/* ========================= */}
        {/* DAYS */}
        {/* ========================= */}

        {days.map((day) => (
          <th
            key={day}
            className="min-w-13 border px-2 py-3 text-center text-sm font-semibold"
          >
            {day}
          </th>
        ))}

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}

        <th className="min-w-15 border px-2 py-3 text-center text-sm font-semibold">
          P
        </th>

        <th className="min-w-15 border px-2 py-3 text-center text-sm font-semibold">
          L
        </th>

        <th className="min-w-15 border px-2 py-3 text-center text-sm font-semibold">
          A
        </th>

        <th className="min-w-17.5 border px-2 py-3 text-center text-sm font-semibold">
          Total
        </th>
      </tr>
    </thead>
  );
}
