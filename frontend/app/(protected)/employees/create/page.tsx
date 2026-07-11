// src/app/employees/create/page.tsx

import CreateEmployeeForm from "@/components/employees/CreateEmployeeForm";

export default function CreateEmployeePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <CreateEmployeeForm />
      </div>
    </main>
  );
}
