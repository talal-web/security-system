type Props = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

export default function EmployeeInfoCard({ icon, label, value }: Props) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 break-words text-[15px] font-semibold leading-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}
