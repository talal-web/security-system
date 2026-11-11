type StatusItemProps = {
  label: string;
  status?: string;
};

export default function StatusItem({ label, status = "Online" }: StatusItemProps) {
  return (
    <div className="flex h-8 items-center justify-between px-1">
      <span className="truncate text-sm text-slate-600">{label}</span>

      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
        {status}
      </span>
    </div>
  );
}
