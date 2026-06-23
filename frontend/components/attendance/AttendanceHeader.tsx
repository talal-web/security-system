"use client";

interface AttendanceHeaderProps {
  alreadyMarked?: boolean;
}

export default function AttendanceHeader({
  alreadyMarked,
}: AttendanceHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Session</h1>

          <p className="mt-1 text-sm text-gray-500">
            Mark attendance for all employees
          </p>
        </div>

        {alreadyMarked && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p className="font-medium text-amber-700">
              Attendance has already been marked for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
