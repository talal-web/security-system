// app/employees/[id]/edit/page.tsx

import UpdateEmployeeForm from "@/components/employees/UpdateEmployeeForm";

import { getEmployeeById } from "@/services/employeeService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEmployeePage({ params }: Props) {
  const { id } = await params;

  const employee = await getEmployeeById(id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <UpdateEmployeeForm employee={employee} />
      </div>
    </main>
  );
}
