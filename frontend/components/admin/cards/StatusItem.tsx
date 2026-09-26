type StatusItemProps = {
  label: string;
};

export default function StatusItem({ label }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

        <span className="truncate text-[11px] font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="text-[9px] font-semibold text-emerald-600">Online</span>
    </div>
  );
}
