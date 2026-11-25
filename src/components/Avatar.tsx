const SIZES = {
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
  lg: "size-12 text-base",
} as const;

interface AvatarProps {
  name: string;
  color: string;
  size?: keyof typeof SIZES;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, color, size = "md" }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-semibold text-white ${SIZES[size]}`}
      style={{ backgroundColor: color }}
    >
      {initials(name) || "?"}
    </span>
  );
}
