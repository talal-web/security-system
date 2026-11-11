import { cn } from "@/lib/utils";

function getInitials(name?: string) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserAvatar({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-xs font-semibold text-white",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
